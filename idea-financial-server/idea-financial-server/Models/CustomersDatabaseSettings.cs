using System;
namespace idea_financial_server.Models
{
    public class CustomersDatabaseSettings : ICustomersDatabaseSettings
    {
        public string CustomersCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface ICustomersDatabaseSettings
    {
        string CustomersCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}
