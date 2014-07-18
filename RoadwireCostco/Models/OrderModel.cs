using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RoadwireCostco
{
    public class OrderModel
    {
        public OrderModel(DateTime created) 
        {
            Created = created;
        }

        public OrderModel() : this(DateTime.Now)
        {

        }

        public DateTime Created { get; set; }
        public string Email { get; set; }
        public string LastName { get; set; }
        public string Postal { get; set; }
        public string Phone { get; set; }
    }
}