using CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Tables;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Graph.Models;
using CAS.FinancePortal.Web.Server.Core.Models.Entities.CurrentApplication.Views;
using CAS.FinancePortal.Web.Server.Core.Models.Entities.SuperApplication.Tables;
namespace CAS.FinancePortal.Web.Server.Persistence.EntityConfigurations.CurrentApplication.Tables
{
	public class DepartmentConfig : IEntityTypeConfiguration<Department>
	{
		public void Configure(EntityTypeBuilder<Department> builder)
		{
            builder.ToTable("Departments");
            builder.Property(e => e.Id).ValueGeneratedNever();
            builder.Property(e => e.Alias)
                .IsRequired()
                .HasMaxLength(50);
            builder.Property(e => e.CreatedDate).HasColumnType("datetime");
            builder.Property(e => e.DepartmentName)
                .IsRequired()
                .HasMaxLength(50);
            builder.Property(e => e.ModifiedDate).HasColumnType("datetime");
            builder.Property(e => e.Timezone).HasMaxLength(50);
        }
	}
}
