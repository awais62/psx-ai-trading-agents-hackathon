import Header from "../components/layout/Header";
import Badge from "../components/common/Badge";
import Loading from "../components/common/Loading";
import ErrorBox from "../components/common/ErrorBox";
import { useApi } from "../hooks/useApi";
import { api } from "../services/api";

export default function Portfolio() {
  const { data, loading, error, refetch } = useApi(
    () => api.getPortfolio(),
    [],
    30000
  );

  const positions = data?.portfolio || [];

  return (
    <>
      <Header
        title="Portfolio"
        subtitle="Current positions and simulated paper-trading allocations"
      />

      {loading ? (
        <Loading message="Loading portfolio..." />
      ) : error ? (
        <ErrorBox message={error} onRetry={refetch} />
      ) : positions.length === 0 ? (
        <div className="card">
          <p className="text-muted text-center py">
            No positions yet. Run analysis to generate trade signals.
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Type</th>
                  <th>Shares</th>
                  <th>Avg Entry</th>
                  <th>Current Price</th>
                  <th>P&L</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((p, i) => {
                  const pnl = p.pnl ?? 0;
                  return (
                    <tr key={i}>
                      <td className="font-semibold">{p.ticker}</td>
                      <td>
                        <Badge variant="info">
                          {p.asset_type || "Equity"}
                        </Badge>
                      </td>
                      <td>{Number(p.quantity).toLocaleString()}</td>
                      <td>
                        Rs. {Number(p.avg_entry_price).toLocaleString()}
                      </td>
                      <td>
                        Rs.{" "}
                        {Number(p.current_price || 0).toLocaleString()}
                      </td>
                      <td
                        className={
                          pnl >= 0 ? "text-positive" : "text-negative"
                        }
                      >
                        {pnl >= 0 ? "+" : ""}
                        Rs. {Number(pnl).toLocaleString()}
                      </td>
                      <td>
                        <Badge
                          variant={
                            p.status === "open" ? "positive" : "neutral"
                          }
                        >
                          {p.status || "open"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
