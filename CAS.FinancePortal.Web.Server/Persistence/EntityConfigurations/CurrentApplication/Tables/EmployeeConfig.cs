using CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Graph.Models;
using CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Views;
using CAS.FinancePortal.Web.Server.Core.Models.Entities.SuperApplication.Tables;
namespace CAS.FinancePortal.Web.Server.Persistence.EntityConfigurations.CurrentApplication.Tables
{
	public class EmployeeConfig : IEntityTypeConfiguration<Employee>
	{
		public void Configure(EntityTypeBuilder<Employee> builder)
		{
            builder.ToTable("Vw_Employees");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Id).HasColumnName("EmployeeId").ValueGeneratedNever();
            builder.Ignore(e => e.EmployeeId);

            builder.Property(e => e.CompanyEmail).HasMaxLength(50);
            builder.Ignore(e => e.DepartmentName);
            builder.Ignore(e => e.ImmediateSuperior);
            builder.Ignore(e => e.TeamId);
            builder.Ignore(e => e.TeamName);

            builder.Property(e => e.FirstName)
                .IsRequired()
                .HasMaxLength(50);
            builder.Property(e => e.Gender)
                .IsRequired()
                .HasMaxLength(50);
            builder.Property(e => e.LastName)
                .IsRequired()
                .HasMaxLength(50);
            builder.Property(e => e.MobileNo)
                .IsRequired()
                .HasMaxLength(50);
            builder.Property(e => e.Tin)
                .HasMaxLength(50)
                .HasColumnName("TIN");
            builder.Property(e => e.YearId)
                .IsRequired()
                .HasMaxLength(50);
        }
    }
}
