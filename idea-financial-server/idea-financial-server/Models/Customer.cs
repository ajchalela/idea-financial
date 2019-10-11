using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace idea_financial_server.Models
{
    public class Customer
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("name")]
        public string CustomerName { get; set; }

        [BsonElement("availableFunds")]
        public float AvailableFunds { get; set; }

        [BsonElement("creditLimit")]
        public float CreditLimit { get; set; }

        [BsonElement("balance")]
        public float Balance { get; set; }
    }
}
