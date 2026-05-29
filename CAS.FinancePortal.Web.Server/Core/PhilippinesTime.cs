namespace CAS.FinancePortal.Web.Server.Core;

/// <summary>
/// Philippines (Asia/Manila, UTC+8) wall-clock time for checklist and monitoring records.
/// Values are stored in SQL datetime2 without timezone offset; treat as PH local time.
/// </summary>
public static class PhilippinesTime
{
    private static readonly TimeZoneInfo PhilippinesZone = ResolveTimeZone();

    public static DateTime Now => TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, PhilippinesZone);

    public static DateTime Today => Now.Date;

    public static DateTimeOffset NowOffset => TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, PhilippinesZone);

    private static TimeZoneInfo ResolveTimeZone()
    {
        foreach (var id in new[] { "Asia/Manila", "Singapore Standard Time" })
        {
            try
            {
                return TimeZoneInfo.FindSystemTimeZoneById(id);
            }
            catch (TimeZoneNotFoundException)
            {
                continue;
            }
            catch (InvalidTimeZoneException)
            {
                continue;
            }
        }

        return TimeZoneInfo.CreateCustomTimeZone(
            "Philippines",
            TimeSpan.FromHours(8),
            "Philippines Standard Time",
            "Philippines Standard Time");
    }
}
