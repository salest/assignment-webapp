using Microsoft.JSInterop;
namespace Tx
{
    public interface IChartJsInterop
    {
        bool IsReady { get; }
        Task Draw(Report[] reports);
    }

    public class ChartJsInterop : IChartJsInterop
    {
        IJSRuntime _js { get; set; }
        IJSObjectReference? _jsMod = null;

        public ChartJsInterop(IJSRuntime jSRuntime)
        {
            _js = jSRuntime;
            _ = LoadModules();
        }

        async Task<bool> LoadModules()
        {
            if (_jsMod == null)
            {
                _jsMod = await _js.InvokeAsync<IJSObjectReference>("import", "./scripts/chartjs_app.js");
            }
            return _jsMod != null;
        }

        public bool IsReady => _jsMod != null;
        public async Task Draw(Report[] reports)
        {
            if(!await LoadModules()) { return; }
            await _jsMod!.InvokeVoidAsync("draw", (object) reports);
        }
    }
}