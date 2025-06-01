import * as fs from 'fs';
import * as readline from 'readline';

async function readFileLines(filePath: string): Promise<string[]> {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const lines: string[] = [];

    for await (const line of rl) {
        const trimmed = line.trim();
        if (trimmed.length > 0 && !trimmed.startsWith('#')) {
            lines.push(trimmed);
        }
    }

    return lines;
}

function getRandomSelection<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

async function main() {
    const filePath = process.argv[2];

    if (!filePath) {
        console.error('Usage: node get_poll_items.js ideas.txt');
        process.exit(1);
    }

    try {
        const lines = await readFileLines(filePath);
        if (lines.length === 0) {
            console.log('No valid lines to choose from.');
            return;
        }

        const selection = getRandomSelection(lines, Math.min(5, lines.length));
        selection.forEach(line => console.log(line));
    } catch (error) {
        console.error('Error reading file:', error);
    }
}

main();
