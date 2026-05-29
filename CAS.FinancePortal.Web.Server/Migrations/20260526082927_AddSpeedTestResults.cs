using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CAS.FinancePortal.Web.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddSpeedTestResults : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SpeedTestResults",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EmployeeId = table.Column<int>(type: "int", nullable: false),
                    DownloadMbps = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    UploadMbps = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LatencyMs = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PublicIp = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ClientBrowser = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ClientOs = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RawJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MeasuredAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpeedTestResults", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SpeedTestResults");
        }
    }
}
