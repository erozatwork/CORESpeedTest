namespace CAS.FinancePortal.Web.Server.Core.Models
{
    public class ServiceResponse<T>
    {
        public bool IsSuccess { get; set; } = true;
        public int Status { get; set; } = 200;
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
    }

    public class ServiceResponse
    {
        public bool IsSuccess { get; set; } = true;
        public int Status { get; set; } = 200;
        public string Message { get; set; } = string.Empty;
    }
}
