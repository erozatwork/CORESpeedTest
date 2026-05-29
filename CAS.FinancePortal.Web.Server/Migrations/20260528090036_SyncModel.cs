using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CAS.FinancePortal.Web.Server.Migrations
{
    /// <inheritdoc />
    public partial class SyncModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
                migrationBuilder.Sql(@"IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Checklist_Vw_Employees_EmployeeId')
            ALTER TABLE [Checklist] DROP CONSTRAINT [FK_Checklist_Vw_Employees_EmployeeId];");

            migrationBuilder.Sql(@"
IF OBJECT_ID('Vw_Employees','U') IS NOT NULL
BEGIN
    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'PK_Vw_Employees')
        ALTER TABLE [Vw_Employees] DROP CONSTRAINT [PK_Vw_Employees];
    EXEC sp_rename 'Vw_Employees', 'Employee';
    IF COL_LENGTH('Employee','IsActive') IS NOT NULL
        ALTER TABLE [Employee] ALTER COLUMN [IsActive] bit NOT NULL;
    IF COL_LENGTH('Employee','EmployeeId') IS NOT NULL
        ALTER TABLE [Employee] ALTER COLUMN [EmployeeId] nvarchar(100) NOT NULL;
    IF COL_LENGTH('Employee','Id') IS NULL
        ALTER TABLE [Employee] ADD [Id] int IDENTITY(1,1) NOT NULL;
    IF COL_LENGTH('Employee','DepartmentName') IS NULL
        ALTER TABLE [Employee] ADD [DepartmentName] nvarchar(100) NULL;
    IF COL_LENGTH('Employee','ImmediateSuperior') IS NULL
        ALTER TABLE [Employee] ADD [ImmediateSuperior] nvarchar(100) NULL;
    IF COL_LENGTH('Employee','TeamId') IS NULL
        ALTER TABLE [Employee] ADD [TeamId] int NULL;
    IF COL_LENGTH('Employee','TeamName') IS NULL
        ALTER TABLE [Employee] ADD [TeamName] nvarchar(100) NULL;
    IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'PK_Employee' AND object_id = OBJECT_ID('Employee'))
        ALTER TABLE [Employee] ADD CONSTRAINT [PK_Employee] PRIMARY KEY ([Id]);
END

IF OBJECT_ID('Employee','U') IS NOT NULL AND OBJECT_ID('Checklist','U') IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Checklist_Employee_EmployeeId')
        ALTER TABLE [Checklist] ADD CONSTRAINT [FK_Checklist_Employee_EmployeeId] FOREIGN KEY ([EmployeeId]) REFERENCES [Employee]([Id]);
END
" );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Checklist_Employee_EmployeeId",
                table: "Checklist");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Employee",
                table: "Employee");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Employee");

            migrationBuilder.DropColumn(
                name: "DepartmentName",
                table: "Employee");

            migrationBuilder.DropColumn(
                name: "ImmediateSuperior",
                table: "Employee");

            migrationBuilder.DropColumn(
                name: "TeamId",
                table: "Employee");

            migrationBuilder.DropColumn(
                name: "TeamName",
                table: "Employee");

            migrationBuilder.RenameTable(
                name: "Employee",
                newName: "Vw_Employees");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                table: "Vw_Employees",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<int>(
                name: "EmployeeId",
                table: "Vw_Employees",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Vw_Employees",
                table: "Vw_Employees",
                column: "EmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Checklist_Vw_Employees_EmployeeId",
                table: "Checklist",
                column: "EmployeeId",
                principalTable: "Vw_Employees",
                principalColumn: "EmployeeId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
