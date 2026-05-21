namespace CAS.FinancePortal.Web.Server.Core.Models.Entities.SuperApplication.Tables;

public class ClientInformation
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string EmailAddress { get; set; } = null!;

    public int ClientDepartment { get; set; }

    public bool IsActive { get; set; }

    public string CompanyName { get; set; } = null!;
}
