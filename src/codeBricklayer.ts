
/**
 * Author: Siyuan Liu
 * Date    : 3/28/2023
 * Purpose:
 * 	Reduce coding time.
 */

import { EOF } from "dns";
import { link } from "fs";

const reLine = /.*(\r)*\n/;
const reArchHead = /^\/\.\.\.\n/;
const reArchTail = /^\.\.\.\/\n/;
const reBrickHead = /^\/---\n/;
const reBrickTail = /^---\/\n/;

export class CodeBricklayer {

	srcContent : string;
	dstContent : string;
	relay : string;
	codeArch : string;

	constructor() {
		this.srcContent = "";
		this.dstContent = "";
		this.relay = "";
		this.codeArch = "";
	}

	pushBluePrint(src :string) {
		this.srcContent = src;
		this.relay = src;
		this.codeArch = "";
		this.dstContent = "";
	}

	readline() : string {
		let line = this.relay.match(reLine);

		if (line === null) {
			return EOF;
		}

		this.relay = this.relay.replace(reLine, "");

		return line[0];
	}

	archPrase() : void {
		var line : string;
		while (true) {
			line = this.readline();
			if (line === EOF) {
				return;
			}

			if (line.match(reArchHead)) {
				break;
			}
		}

		while (true) {
			line = this.readline();
			if (line === EOF) {
				break;
			}

			if (!line.match(reArchTail)) {
				this.codeArch += line;
			} else {
				break;
			}
		}

		// console.log(this.codeArch);
	}

	bricklay() : void {
		var line : string;
		var reCond = /\$<.+?>/g;
		var separator : string;
		var match : boolean;

		this.relay = this.srcContent;
		while (true) {
			line = this.readline();
			if (line === EOF) {
				return;
			}

			if (line.match(reBrickHead)) {
				break;
			}
		}

		/* Get the Specified separator. */
		separator = this.readline();
		if (separator === EOF) {
			return;
		}
		separator = separator.replace(/(\r)*\n/, "");
		// console.log(separator);

		/* Get the identifier of the brick */
		line = this.readline();
		if (line === EOF) {
			return;
		}

		line = line.replace("\n", "");
		let ids = line.split(separator);
		// console.log(ids);

		/* Code bricklayer start working. */
		while (true) {
			line = this.readline();
			line = line.replace("\n", "");

			if (line === EOF) {
				break;
			}

			if (!line.match(reBrickTail)) {
				let bricks = line.split(separator);
				let num = bricks.length;
				// console.log(bricks, num);

				let code = this.codeArch;

				/* Process $<> */
				let condBlk = code.match(reCond);
				// console.log(condBlk);

				if (condBlk) {
					for (var i = 0; i < condBlk?.length; i++) {
						var oldBlk = condBlk[i];
						var newBlk = condBlk[i];
						var match = false;

						for (var j = 0; j < ids.length; j++) {
							let id = `\${${ids[j]}}`;

							var exist = newBlk.indexOf(id);
							if (exist < 0) {
								continue;
							}

							if (j < num && bricks[j] !== "") {
								newBlk = newBlk.replaceAll(id, bricks[j]);
								match = true;
							} else {
								newBlk = newBlk.replaceAll(id, "");
							}
						}

						if (!match) {
							newBlk = "";
						}

						newBlk = newBlk.replace(/\$<(.+)>/, "$1");
						code = code.replace(oldBlk, newBlk);

						// console.log(code);
					}
				}

				for (var i = 0; i < ids.length; i++) {
					let id = `\${${ids[i]}}`;

					if (i < num) {
						code = code.replaceAll(id, bricks[i]);
					} else {
						code = code.replaceAll(id, "");
					}
				}

				this.dstContent += code;
				// console.log(this.dstContent);
			} else {
				break;
			}
		}
	}

	popContent() : string {
		return this.dstContent;
	}
}

// let cb = new CodeBricklayer("...\n$< ${a}> ${b} $<sss${c}>\n...\n---\n,\na,b,c\n1,2\n4,5,6\n");
// cb.archPrase();
// cb.bricklay();