import json
import os
import sys


def load_report(filepath):
    with open(filepath, "r") as f:
        return json.load(f)


def write_report(filepath, report):
    with open(filepath, "w") as f:
        json.dump(report, f)


def set_abs_path(path, report):
    if not isinstance(report, list):
        print("CodeQuality report is not a list")
    else:
        for index in range(len(report)):
            if "location" in report[index] and "path" in report[index]["location"]:
                report[index]["location"]["path"] = os.path.join(
                    path, report[index]["location"]["path"]
                )
    return report


if __name__ == "__main__":
    path = sys.argv[1]
    report_file = sys.argv[2]

    report = load_report(report_file)
    report = set_abs_path(path, report)
    write_report(report_file, report)
