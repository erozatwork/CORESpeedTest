//using Core.Agile.OpsPortal.Web.Server.Core.Models.Entities.CurrentApplication.Views;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Metadata.Builders;

//namespace Core.Agile.OpsPortal.Web.Server.Persistence.EntityConfigurations.CurrentApplication.Views
//{
//	public class VwDepartmentTeamConfig : IEntityTypeConfiguration<VwDepartmentTeam>
//	{
//		public void Configure(EntityTypeBuilder<VwDepartmentTeam> builder)
//		{
//			builder
//				.HasNoKey()
//				.ToView("vw_department_teams");

//			builder.Property(e => e.Alias)
//				.IsRequired()
//				.HasMaxLength(50);
//			builder.Property(e => e.Id).ValueGeneratedOnAdd();
//			builder.Property(e => e.Name)
//				.IsRequired()
//				.HasColumnName("name");
//		}
//	}
//}
