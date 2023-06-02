using eckumoc_js_lasmart.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;

namespace eckumoc_js_lasmart.Controllers
{
    public class PointsApiController : Controller {
        private ILogger<PointsApiController> _logger { get; }
        public PointsApiController(ILogger<PointsApiController> logger)
        {
            this._logger = logger;
        }
        public async Task<IActionResult> RemoveComment([FromServices] PointsDbContext db, int id)
        {
            _logger.LogInformation("RemoveComment", id);
            var comment = db.Comments.Find(id);
            if (comment == null)
            {
                return NoContent();
            }
            else
            {
                db.Comments.Remove(comment);
                await db.SaveChangesAsync();
                return Ok(comment.Id);
            }
        }
        public async Task<IActionResult> AddComment([FromServices] PointsDbContext db, int id, string message, string color)
        {
            _logger.LogInformation("AddComment", id, message, color);
            var point = await db.Points.Include(p => p.Comments).FirstOrDefaultAsync(p => p.Id == id);
            if (point == null)
            {
                return NotFound(id);
            }
            else
            {
                var comment = new Comment()
                {
                    Message = message,
                    Color = color
                };
                db.Comments.Add(comment);
                point.Comments.Add(comment);
                if (await db.SaveChangesAsync() != 0)
                {
                    return Ok(comment.Id);
                }
                else
                {
                    return NoContent();
                }
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetAll([FromServices] PointsDbContext db)
        {
            _logger.LogInformation("GetAll");
            var data = await db.Points.Include(p => p.Comments).ToListAsync();
            return Json(data);
        }
        [HttpPut]
        [HttpPost]
        public async Task<IActionResult> Create([FromServices] PointsDbContext db, int x, int y, int r, string color)
        {
            _logger.LogInformation("Create", x, y, r, color);
            var point = new Point()
            {
                X = x,
                Y = y,
                R = r,
                Color = color,
                Comments = new List<Comment>()
            };
            db.Points.Add(point);
            if (await db.SaveChangesAsync() != 0)
            {
                return Ok(point.Id);
            }
            else
            {
                return NoContent();
            }
        }

        [HttpGet]
        [HttpDelete]
        public async Task<IActionResult> Delete([FromServices] PointsDbContext db, int Id)
        {
            _logger.LogInformation("Delete", Id);
            var point = await db.Points.FindAsync(Id);
            if (point == null)
            {
                return NotFound(Id);
            }
            else
            {
                db.Points.Remove(point);
                if (await db.SaveChangesAsync() != 0)
                {
                    return Ok(Id);
                }
                else
                {
                    return NotFound(Id);
                }
            }
        }
    }
    public class PointsController : PointsApiController
    {
        ILogger<PointsController> _logger;
        public PointsController(ILogger<PointsController> logger): base(logger) => this._logger = logger;

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error() => View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        public IActionResult Index() => RedirectToAction("Diagram"); 
        public IActionResult Table([FromServices] PointsDbContext db)=> View();
        public IActionResult Diagram([FromServices] PointsDbContext db) => View();
        
    }
}
