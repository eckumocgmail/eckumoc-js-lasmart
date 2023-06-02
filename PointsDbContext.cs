using Microsoft.EntityFrameworkCore;

using System.Collections.Generic;
using System.Linq;

namespace eckumoc_js_lasmart.Models
{
    public class PointsDbContext: DbContext { 

        public DbSet<Point> Points { get; set; }
        public DbSet<Comment> Comments { get; set; }

        public PointsDbContext(DbContextOptions options): base(options)
        {
        }

        public static void InitData(PointsDbContext db)
        {
            if (db.Points.Count() == 0)
            {
                Point p = null;
                Comment c = null;
                db.Points.Add(p = new Point()
                {
                    X = 100 * (db.Points.Count() + 1),
                    Y = 100 * (db.Points.Count() + 1),
                    Color = "#000210",
                    R = 30,
                    Comments = new List<Comment>()
                    {

                    }
                });
                db.SaveChanges();
                db.Comments.Add(c = new Comment()
                {
                    Message = "Test",
                    Color = "black",
                    IdPoint = p.Id
                });
                p.Comments.Add(c);
                db.SaveChanges();
                db.Points.Add(p = new Point()
                {
                    X = 100 * (db.Points.Count() + 1),
                    Y = 100 * (db.Points.Count() + 1),
                    Color = "#000210",
                    R = 30,
                    Comments = new List<Comment>()
                    {
                    }
                });
                db.SaveChanges();
                db.Comments.Add(c = new Comment()
                {
                    Message = "Test",
                    Color = "black"
                });
                p.Comments.Add(c);
                db.SaveChanges();
            }
        }
    }

    public class Comment
    {
        
        public int IdPoint { get; set; }
        public int Id { get; set; }
        public string Message { get; set; }
        public string Color { get; set; }

    }
    public class Point
    {
        public int Id { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int R { get; set; }
        public string Color { get; set; }
        public List<Comment> Comments { get; set; }
    }
}
