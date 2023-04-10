from os import getenv

import boto3
import plotly
import plotly.graph_objects as go
from plotly.subplots import make_subplots

from .find_stock import find_stock

folder = "/cron/aifa_cron/ai_trainer/result/stock_graph"
grab_list = [
    "AAPL",
    "AMZN",
    "BABA",
    "CSCO",
    "GOOG",
    "META",
    "MSFT",
    "NVDA",
    "ORCL",
    "TSLA",
]

s3_resource = boto3.resource(
    "s3",
    endpoint_url=getenv("S3_ENDPOINT"),
    aws_access_key_id=getenv("S3_ACCESS_KEY"),
    aws_secret_access_key=getenv("S3_SECRET_KEY"),
)


def plot_stock_graph(symbol: str):
    stock_data = find_stock(symbol)
    stock_fig = make_subplots(
        rows=3,
        cols=1,
        shared_xaxes=True,
        subplot_titles=(
            f"{symbol} OHLC",
            f"{symbol} Moving Average",
            f"{symbol} Volume",
        ),
        vertical_spacing=0.05,
    )
    # Plot Candlestick graph
    stock_fig.add_trace(
        go.Candlestick(
            x=stock_data["date"],
            open=stock_data["open"],
            high=stock_data["high"],
            low=stock_data["low"],
            close=stock_data["close"],
            name="Price",
        ),
        row=1,
        col=1,
    )

    # Create SMA and EMA as techincal indicator
    # EMA (Exponential Moving Average)
    stock_data["EMA_9"] = stock_data["close"].ewm(9).mean().shift()
    # SMA (Simple Moving Average)
    stock_data["SMA_5"] = stock_data["close"].rolling(5).mean().shift()
    stock_data["SMA_10"] = stock_data["close"].rolling(10).mean().shift()
    # Plot SMA and EMA graph
    stock_fig.add_trace(
        go.Scatter(x=stock_data["date"], y=stock_data["EMA_9"], name="EMA 9"),
        row=2,
        col=1,
    )
    stock_fig.add_trace(
        go.Scatter(x=stock_data["date"], y=stock_data["SMA_5"], name="SMA 5"),
        row=2,
        col=1,
    )
    stock_fig.add_trace(
        go.Scatter(x=stock_data["date"], y=stock_data["SMA_10"], name="SMA 10"),
        row=2,
        col=1,
    )

    # Plot volume graph (graph type problem: Bar chart cannot show infinitesimal width)
    stock_fig.add_trace(
        go.Scatter(
            x=stock_data["date"],
            y=stock_data["volume"],
            name="Volume",
            showlegend=False,
        ),
        row=3,
        col=1,
    )

    stock_fig.update_xaxes(
        rangebreaks=[
            dict(bounds=["sat", "mon"]),
            dict(bounds=[16, 9.5], pattern="hour"),
        ],
    )

    # Add configurations to graph
    stock_fig.update_layout(xaxis_rangeslider_visible=False)
    stock_fig.update_layout(title_text=f"{symbol} Stock Data")
    stock_fig.update_xaxes(title_text="Date", row=3, col=1)
    stock_fig.update_yaxes(title_text="Price (USD$)", row=1, col=1)
    stock_fig.update_yaxes(title_text="Price (USD$)", row=2, col=1)
    stock_fig.update_yaxes(title_text="Volume (USD$)", row=3, col=1)
    stock_fig.write_image(f"{folder}/png/{symbol}.png", height=1000, width=1500)
    fig_div = plotly.offline.plot(
        stock_fig, include_plotlyjs=False, filename=f"{symbol}.html", output_type="div"
    )
    with open(f"{folder}/html/{symbol}.html", "w") as f:
        f.write(fig_div)
    print("Plotly visualisation finished!")

    # Upload html file to MinIO
    s3_resource.Bucket("stockgraph").upload_file(
        f"{folder}/png/{symbol}.png", f"{symbol}.png"
    )
    print("MinIO finish uploading file!")


if __name__ == "__main__":
    try:
        s3_resource.create_bucket(Bucket="stockgraph")
    except Exception:
        pass
    for i in grab_list:
        plot_stock_graph(i)
