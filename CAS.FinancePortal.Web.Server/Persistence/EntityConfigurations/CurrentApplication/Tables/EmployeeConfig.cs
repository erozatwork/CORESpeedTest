using CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace CAS.FinancePortal.Web.Server.Persistence.EntityConfigurations.CurrentApplication.Tables
{
	public class EmployeeConfig : IEntityTypeConfiguration<Employee>
	{
		public void Configure(EntityTypeBuilder<Employee> builder)
		{
            builder.ToTable("Employee");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Id)
                .ValueGeneratedOnAdd();

            builder.Property(e => e.EmployeeId)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(e => e.YearId)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(e => e.IsActive)
                .HasDefaultValue(true);

            builder.Property(e => e.FirstName)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(e => e.Gender)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(e => e.LastName)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(e => e.CompanyEmail)
                .HasMaxLength(50);

            builder.Property(e => e.DepartmentId)
                .IsRequired();

            builder.Property(e => e.DepartmentName)
                .HasMaxLength(100);

            builder.Property(e => e.DateHired)
                .HasColumnType("date");

            builder.Property(e => e.MobileNo)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(e => e.ImmediateSuperior)
                .HasMaxLength(100);

            builder.Property(e => e.TeamId);

            builder.Property(e => e.TeamName)
                .HasMaxLength(100);

            builder.Property(e => e.Tin)
                .HasMaxLength(50)
                .HasColumnName("TIN");

        }
    }
}
