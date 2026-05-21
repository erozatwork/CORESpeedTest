using Azure.Core;
using CAS.FinancePortal.Web.Server.Core.ServiceLibraries;
using Microsoft.AspNetCore.StaticFiles;
using static System.Net.WebRequestMethods;
using File = System.IO.File;

namespace CAS.FinancePortal.Web.Server.Persistence.ServiceLibraries
{
	public class FileService(
		IConfiguration configuration,
		IGraphService graphService
		) : IFileService
	{
		private readonly IConfiguration _configuration = configuration;
		private readonly IGraphService _graphService = graphService;
		public async Task<(string FilePath, string ContentType)> GetDocumentUrlAsync(string filePath)
		{
			var rootFilePath = Path.Combine(filePath);

			if (!await Task.Run(() => File.Exists(rootFilePath)))
			{
				throw new FileNotFoundException($"File not found: {rootFilePath}");
			}

			var fileProvider = new FileExtensionContentTypeProvider();
          if (!fileProvider.TryGetContentType(rootFilePath, out string? contentType))
			{
				throw new ArgumentOutOfRangeException($"Unable to find Content Type for file name {rootFilePath}.");
			}

         return (rootFilePath, contentType);

		}


		public async Task ConvertDocxToPdf(string docx, string pdf)
		{

			try 
			{

				var groupNickName = _configuration["MicrosoftGraph:GroupMailNickname"]!;
				var tempFolder = _configuration["MicrosoftGraph:TempFolder"]!;

				var groupId = await _graphService.GetGroupIdByMailNicknameAsync(groupNickName);
				var driveId = await _graphService.GetGroupDriveIdAsync(groupId);


				// Upload DOCX to Temp Folder
				var docxBytes = await File.ReadAllBytesAsync(docx);
				var itemId = await _graphService.UploadDocxToDriveAsync(driveId, tempFolder, Path.GetFileName(docx), docxBytes);


				var pdfBytes = await _graphService.DownloadPdfFromDriveItemAsync(driveId, itemId);
				if (pdfBytes != null && pdfBytes.Length > 0)
				{
					await File.WriteAllBytesAsync(pdf, pdfBytes);
				}

				await _graphService.DeleteDriveItemAsync(driveId, itemId);


			}
			catch (Exception ex)
			{
				throw new Exception($"Error converting DOCX to PDF: {ex.Message}", ex);
			}
		}
	}

	public interface IFileService
	{
		Task<(string FilePath, string ContentType)> GetDocumentUrlAsync(string filePath);
		Task ConvertDocxToPdf(string docx, string pdf);
	}
}
