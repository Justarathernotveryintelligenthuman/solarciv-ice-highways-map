class Pathfinder {
    constructor(data) {
        this.graph = {};
        let stations = data.stations;
        let errorMessage = document.getElementById("data-error");

        for (let station of stations) {
            let reachable = {};
            for (let company in station.lines) {
                if (station.lines[company] == null) {
                    errorMessage.innerText = `Error: station ${station.id} (${station.name}) has null lines for company ${company}`;
                    continue;
                }
                for (let line in station.lines[company]) {
                    let branches = [station.lines[company][line][1]];
                    if (!branches[0].startsWith("connection to ") && branches[0].includes(" to ")) branches = branches[0].split(" to ", 2);
                    if (!branches[0].startsWith("connection to ") && branches[0].includes(" and ")) branches = branches[0].split(" and ");
                    for (let branch of branches) {
                        if (data.lines[company][line].branches[branch].stations == null) {
                            errorMessage.innerText = `Error: line ${company}.${line}.${branch} has null stations (station ${station.id} (${station.name}))`;
                            continue;
                        }
                        let branchStations = data.lines[company][line].branches[branch].stations.flat();
                        let actualStations = [];
                        branchStations.forEach(element => {
                            if (typeof element !== "string") actualStations.push(element);
                        });
                        let index = actualStations.indexOf(station.id);
                        if (index == -1) {
                            errorMessage.innerText = `Error: station ${station.id} (${station.name}) not found in line ${company}.${line}.${branch} stations`;
                            continue;
                        }
                        let n = actualStations.length;
                        if (n > 1) {
                            if (index == 0)
                                reachable[stations[actualStations[1]].id] = [Math.abs(station.x - stations[actualStations[1]].x) + Math.abs(station.z - stations[actualStations[1]].z), `${company}: ${line}: ${branch}`];
                            else if (index == n - 1)
                                reachable[stations[actualStations[n - 2]].id] = [Math.abs(station.x - stations[actualStations[n - 2]].x) + Math.abs(station.z - stations[actualStations[n - 2]].z), `${company}: ${line}: ${branch}`];
                            else {
                                reachable[stations[actualStations[index + 1]].id] = [Math.abs(station.x - stations[actualStations[index + 1]].x) + Math.abs(station.z - stations[actualStations[index + 1]].z), `${company}: ${line}: ${branch}`];
                                reachable[stations[actualStations[index - 1]].id] = [Math.abs(station.x - stations[actualStations[index - 1]].x) + Math.abs(station.z - stations[actualStations[index - 1]].z), `${company}: ${line}: ${branch}`];
                            }
                        }
                    }
                }
            }
            this.graph[station.id] = reachable;
        }
    }

    // start and end are station IDs
    pathfind(start, end) {
        if (!Object.keys(this.graph).length) {
            console.log("debug: graph is empty");
            return null;
        }

        // FIX: use a proper min-heap priority queue instead of a plain stack so
        // we always expand the lowest-cost node (true Dijkstra, not DFS)
        // Simple priority queue via sorted insertion on a small graph (62 nodes) is fine
        const visited = new Set();
        const distances = { [start]: 0 };
        const previous = { [start]: null };
        // queue entries: [cost, nodeId]
        const queue = [[0, String(start)]];

        while (queue.length > 0) {
            // Pop lowest-cost entry
            queue.sort((a, b) => a[0] - b[0]);
            const [, current] = queue.shift();

            if (visited.has(current)) continue;
            if (current == String(end)) break;
            visited.add(current);

            const children = this.graph[current];
            if (!children) continue;
            for (let child in children) {
                const distance = this.graph[current][child][0] + distances[current];
                if (distances[child] === undefined || distance < distances[child]) {
                    distances[child] = distance;
                    queue.push([distance, child]);
                    previous[child] = [Number(current), this.graph[current][child][1]];
                }
            }
        }

        // FIX: guard against unreachable destination
        if (previous[end] === undefined) {
            console.log("debug: destination unreachable");
            return null;
        }

        const path = [];

        // FIX: path reconstruction now correctly includes the start station.
        // Walk backwards from end; loop terminates when previous[at[0]] is null (the start node).
        // We push at first, THEN advance, so start is included.
        let at = [Number(end), previous[end] ? previous[end][1] : ""];
        while (at !== null) {
            path.push(at);
            const prev = previous[at[0]];
            if (prev === null) break; // reached start
            at = [Number(prev[0]), prev[1]];
        }

        return [path.reverse(), distances[end]];
    }
}
