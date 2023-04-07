#!/bin/bash
cd /cron 
/usr/local/bin/poetry run python3 -m aifa_cron.jobs.grab_daily_stock
echo finish stock grab
/usr/local/bin/poetry run python3 -m aifa_cron.ai_trainer.plot_graph
echo finish graph plot
/usr/local/bin/poetry run python3 -m aifa_cron.ai_trainer.model.lstm_new
echo finish LSTM training
/usr/local/bin/poetry run python3 -m aifa_cron.ai_trainer.model.rnn
echo finish RNN training
