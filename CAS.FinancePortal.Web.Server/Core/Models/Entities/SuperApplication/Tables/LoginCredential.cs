#nullable disable
namespace CAS.FinancePortal.Web.Server.Core.Models.Entities.SuperApplication.Tables;

public class LoginCredential
{
    public int Id { get; set; }

    public int UserReferenceId { get; set; }

    public string UserEmail { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int LoginAttemps { get; set; }

    public bool IsLockOut { get; set; }

    public bool IsActive { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public int UserType { get; set; }
    public virtual ICollection<CoreSystemAccess> CoreSystemAccesses { get; set; } = new List<CoreSystemAccess>();

    public virtual UserType UserTypeNavigation { get; set; }
}
