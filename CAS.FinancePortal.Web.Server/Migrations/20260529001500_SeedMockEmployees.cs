using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CAS.FinancePortal.Web.Server.Migrations
{
    /// <inheritdoc />
    public partial class SeedMockEmployees : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
SET IDENTITY_INSERT [Employee] ON;

INSERT INTO [Employee]
    ([Id], [EmployeeId], [YearId], [IsActive], [FirstName], [LastName], [CompanyEmail], [DepartmentId], [DepartmentName], [DateHired], [Gender], [TIN], [TeamId], [TeamName], [MobileNo], [ImmediateSuperior])
VALUES
    (9,  N'EMP-0009', N'2026', 1, N'Juan',   N'Dela Cruz',   N'juan.delacruz@local.test',   1, N'IT',         '2024-01-15', N'Male',   N'TIN-0009',  1, N'Support',   N'09170000009', N'Maria Santos'),
    (10, N'EMP-0010', N'2026', 1, N'Maria',  N'Santos',      N'maria.santos@local.test',    2, N'Operations', '2023-08-07', N'Female', N'TIN-0010',  2, N'Field Ops', N'09170000010', N'Carlos Reyes'),
    (11, N'EMP-0011', N'2026', 1, N'Carlos', N'Reyes',       N'carlos.reyes@local.test',    3, N'Finance',    '2022-11-03', N'Male',   N'TIN-0011',  NULL, NULL,         N'09170000011', N'Ana Lopez'),
    (12, N'EMP-0012', N'2026', 1, N'Ana',    N'Lopez',       N'ana.lopez@local.test',       1, N'IT',         '2021-05-21', N'Female', N'TIN-0012',  1, N'Support',   N'09170000012', N'Maria Santos'),
    (13, N'EMP-0013', N'2026', 1, N'Mark',   N'Dizon',       N'mark.dizon@local.test',      2, N'Operations', '2024-03-12', N'Male',   N'TIN-0013',  2, N'Field Ops', N'09170000013', N'Carlos Reyes');

SET IDENTITY_INSERT [Employee] OFF;
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
DELETE FROM [Employee]
WHERE [Id] IN (9, 10, 11, 12, 13);
");
        }
    }
}
