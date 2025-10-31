using TaskManager.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowFrontend");

var tasks = new List<TaskItem>();
var nextId = 1;

app.MapGet("/api/tasks", (string? filter) =>
{
    var query = tasks.AsQueryable();
    if (filter == "active") query = query.Where(t => !t.Completed);
    if (filter == "completed") query = query.Where(t => t.Completed);
    return query.ToList();
});

app.MapPost("/api/tasks", (TaskItem task) =>
{
    if (string.IsNullOrWhiteSpace(task.Description))
        return Results.BadRequest("Description is required.");

    task.Id = nextId++;
    task.Completed = false;
    tasks.Add(task);
    return Results.Created($"/api/tasks/{task.Id}", task);
});

app.MapPut("/api/tasks/{id:int}", (int id, TaskItem updatedTask) =>
{
    var task = tasks.FirstOrDefault(t => t.Id == id);
    if (task == null) return Results.NotFound();

    if (!string.IsNullOrWhiteSpace(updatedTask.Description))
        task.Description = updatedTask.Description;
    task.Completed = updatedTask.Completed;

    return Results.Ok(task);
});

app.MapDelete("/api/tasks/{id:int}", (int id) =>
{
    var task = tasks.FirstOrDefault(t => t.Id == id);
    if (task == null) return Results.NotFound();

    tasks.Remove(task);
    return Results.NoContent();
});

app.Run();
