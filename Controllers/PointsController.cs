using eckumoc_js_lasmart.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
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

        public async Task<IActionResult> AddComment(
            [FromServices] PointsDbContext db, 
            int id, string color = "#010101" )
       {


            var buffer = new byte[this.HttpContext.Request.Body.Length];
            await this.HttpContext.Request.Body.ReadAsync(buffer, 0, (int)this.HttpContext.Request.Body.Length);
            var message = Encoding.UTF8.GetString(buffer, 0, buffer.Length);

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
                    return Created("/Points/AddComment", comment.Id);
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

        [HttpGet]
        public async Task<IActionResult> Get([FromServices] PointsDbContext db, int id)
        {
            _logger.LogInformation("Get");
            var data = await db.Points.Include(p => p.Comments).FirstOrDefaultAsync(p=>p.Id==id);
            if(data == null)            
                return NotFound(id);            
            return Json(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromServices] PointsDbContext db, int x, int y, int r, string color)
        {
            _logger.LogInformation($"Create(x={x},y={y},r={r},color={color})");
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
                return Created("/Points/Get", point.Id);
            }
            else
            {
                return NoContent();
            }
        }

        
        [HttpDelete]
        public async Task<IActionResult> Delete([FromServices] PointsDbContext db, int id)
        {
            _logger.LogInformation("Delete", id);
            var point = await db.Points.FindAsync(id);
            if (point == null)
            {
                return NotFound(id);
            }
            else
            {
                db.Points.Remove(point);
                if (await db.SaveChangesAsync() != 0)
                {
                    return Ok(id);
                }
                else
                {
                    return NotFound(id);
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
