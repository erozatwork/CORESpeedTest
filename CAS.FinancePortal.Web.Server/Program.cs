using CAS.FinancePortal.Web.Server.Core.Applications;
using CAS.FinancePortal.Web.Server.Core.DbContext;
using CAS.FinancePortal.Web.Server.Core.ServiceLibraries;
using CAS.FinancePortal.Web.Server.Core.UnitOfWork;
using CAS.FinancePortal.Web.Server.Persistence.Applications;
using CAS.FinancePortal.Web.Server.Persistence.DbContext;
using CAS.FinancePortal.Web.Server.Persistence.ServiceLibraries;
using CAS.FinancePortal.Web.Server.Persistence.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
var fileRootFolder = builder.Environment.IsDevelopment() ? builder.Environment.ContentRootPath : builder.Configuration.GetSection("BaseFileLocation").Value;

// Add services to the container.
builder.Services.AddHttpContextAccessor();


#region SuperApplicationConfig
builder.Services.AddDbContext<SuperApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("SuperApplicationConnection")));
builder.Services.AddScoped<ISuperApplicationDbContext, SuperApplicationDbContext>();
#endregion

builder.Services.AddDbContext<CurrentApplicationDbContext>(
	options => options.UseSqlServer(
			builder.Configuration.GetConnectionString("DefaultConnection"),
			sqlOptions => sqlOptions.EnableRetryOnFailure())
		.EnableSensitiveDataLogging()
);

builder.Services.AddScoped<IUserAuthenticationService, UserAuthenticationService>();
builder.Services.AddScoped<IGlobalServices, GlobalServices>();
//builder.Services.AddScoped<IPurchaseOrderService, PurchaseOrderService>();
//builder.Services.AddScoped<IVendorService, VendorService>();
//builder.Services.AddScoped<IRequestFormService, RequestFormService>();
//builder.Services.AddScoped<IAccountabilityService, AccountabilityService>();

builder.Services.AddScoped<ICurrentApplicationDbContext, CurrentApplicationDbContext>();
builder.Services.AddScoped<ICurrentApplicationUnitOfWork, CurrentApplicationUnitOfWork>();


builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IFileService, FileService>();


#region GraphServiceRegistration

builder.Services.AddScoped<IGraphService>(_ =>
{
	var azureAdConfig = builder.Configuration.GetSection("AzureAd");
	var tenantId = azureAdConfig["TenantId"]
		?? throw new InvalidOperationException("AzureAd:TenantId is missing in configuration.");
	var clientId = azureAdConfig["ClientId"]
		?? throw new InvalidOperationException("AzureAd:ClientId is missing in configuration.");
	var clientSecret = azureAdConfig["ClientSecret"]
		?? throw new InvalidOperationException("AzureAd:ClientSecret is missing in configuration.");

	return new GraphService(tenantId, clientId, clientSecret);

	
});

#endregion


builder.Services.AddControllers(options =>
{
	// Prevents non-nullable strings from being treated as implicitly [Required]
	// This allows optional fields like Signature and Notes to be null in DTOs
	options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true;
}).AddJsonOptions(options =>
{
	options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
	options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
	options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
});

builder.Services.AddAuthentication("Bearer")
	.AddJwtBearer("Bearer", options =>
	{
		options.Authority = "https://172.16.254.4/cas/services/identity_server";

		options.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateAudience = true,
			ValidAudience = "CoreAgileSystem",
			ValidateIssuer = false,
			ValidateIssuerSigningKey = true,
		};
		// Allow internal server with self-signed certificate
		options.RequireHttpsMetadata = false;
		// Preserve JWT claim names exactly as issued (no mapping to long .NET URIs)
		options.MapInboundClaims = false;
		// Trust self-signed cert on the identity server backchannel
		options.BackchannelHttpHandler = new HttpClientHandler
		{
			ServerCertificateCustomValidationCallback =
				HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
		};
	});




builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddAuthorization();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

app.UseDefaultFiles();
var assetsDocsPath = Path.Combine(builder.Environment.ContentRootPath, "assets_docs");
if (!Directory.Exists(assetsDocsPath))
{
    Directory.CreateDirectory(assetsDocsPath);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(assetsDocsPath),
    RequestPath = "/cas/financeportal/assets_docs"
});
app.MapStaticAssets();
app.UseRouting();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();


// CORS must be BEFORE auth/authorization
//app.UseCors(CorsPolicy);
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
