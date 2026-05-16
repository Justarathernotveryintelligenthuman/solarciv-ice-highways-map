# SolarCiv Ice Highways Map

This is a tool that aims to give information on ice highway stations and lines across the SolarCiv server. You can contribute station and line information by posting an issue with the tag 'newlocation.'

# Adding lines to the map (direct push commit method) tutorial

> [!NOTE]
> You can also request the additions to the map via the SolarCiv International Railway Project Discord Server and then make a request there. Thank you.

***PLEASE READ IF YOU ARE ADDING STATIONS AND LINES***

This is a clarification for defining connections between lines and between branches because some of these connections are defined wrong and I am going through to fix them.

For each line, there are branches as such:
```
"Example line": {
  ...
  "branches": {
    "First branch": {
      "vertices": [[x, z], [x, z]],
      "stations": [0, 1, 2, 3, 4]
    },
    "Second branch": {
      "vertices": [[x, z], [x, z]],
      "stations": [5, 6, 7, 8]
    }
  }
}
```
For each station, there are lines that the station is on and the specific branch it is on as well. The branch **MUST BE THE SAME NAME** as described in the line data. For example, the station with the ID 0 is on the First branch of Example line:
```
"Example station": {
  ...
  "id": 0,
  "lines": {
    "Example company": {
      "Example line": ["", "First branch"]
    }
  }
}
```
These are **CASE-SENSITIVE**. That means that if the branch name is "Main line", then the station must refer to it as "Main line", and **NOT** "Main Line" with a capital L.

Additionally, if the station connects multiple **BRANCHES WITHIN THE SAME LINE**, then the stations array of each branch must have corresponding branch references. For example, if the station 1 connects First branch and Second branch, then in the data for First branch, the stations array would look like:

`"stations": [0, [1, "Second branch"], 2, 3, 4]`

Therefore, in Second branch, there must also be an array corresponding to this one:

`"stations": [5, 6, 7, [1, "First branch"], 8]`

These arrays are **NOT** to be used to describe a line connection to another line...only from one branch to another branch within the **SAME LINE**. There is no need to specify which other lines a station may connect to; only the branches it connects to are needed.

Similarly, in the station data, use the keyword "to" to specify a connection of one branch to another branch, but **NEVER** from a line to another line. For station 1, that would looke like:
```
"lines": {
  "Example company": {
    "Example line": ["", "First branch to Second branch"]
  }
}
```
Note that the capitalization does not change, and note that it is simply the string `"First branch to Second branch"`, not an array `["First branch", "Second branch"]`.

## Logs

Nothing here now
