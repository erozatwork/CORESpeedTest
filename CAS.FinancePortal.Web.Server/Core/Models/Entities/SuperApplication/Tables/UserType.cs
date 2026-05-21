namespace CAS.FinancePortal.Web.Server.Core.Models.Entities.SuperApplication.Tables;

public partial class UserType
{
    public int Id { get; set; }

    public string UserTypeName { get; set; } = null!;
    public virtual ICollection<LoginCredential> LoginCredentials { get; set; } = new List<LoginCredential>();

}
