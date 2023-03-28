
/**
 * Author: Siyuan Liu
 * Date    : 3/28/2023
 * Purpose:
 * 	Reduce coding time.
 */

import { EOF } from "dns";
import { link } from "fs";

export class CodeBricklayer {

	srcContent : string;
	dstContent : string;
	relay : string;
	codeArch : string;

	constructor(src : string) {
		this.srcContent = src;
		this.dstContent = "";
		this.relay = src;
		this.codeArch = "";
	}

	readline() : string {
		let line = this.relay.match(/.*\n/);

		if (line === null) {
			return EOF;
		}

		this.relay = this.relay.replace(/.*\n/, "");
		
		return line[0];
	}

	archPrase() : void {
		var reArch = /\.\.\./;
		var line : string;
		while (true) {
			line = this.readline();
			if (line === EOF) {
				return;
			}

			if (line.match(reArch)) {
				break;
			}
		}

		while (true) {
			line = this.readline();
			if (line === EOF) {
				break;
			}

			if (!line.match(reArch)) {
				this.codeArch += line;
			} else {
				break;
			}
		}

		// console.log(this.codeArch);
	}

	bricklay() : void {
		var line : string;
		var reBrick = /---/;
		var reCond = /\$<.+?>/g;
		var separator : string;
		var match : boolean;

		this.relay = this.srcContent;
		while (true) {
			line = this.readline();
			if (line === EOF) {
				return;
			}

			if (line.match(reBrick)) {
				break;
			}
		}

		/* Get the Specified separator. */
		separator = this.readline();
		if (separator === EOF) {
			return;
		}
		separator = separator.replace("\n", "");
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

			if (!line.match(reBrick)) {
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

							if (j < num) {
								newBlk = newBlk.replace(id, bricks[j]);
								match = true;
							} else {
								newBlk = newBlk.replace(id, "");
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
						code = code.replace(id, bricks[i]);
					} else {
						code = code.replace(id, "");
					}
				}
				this.dstContent += code;
				// console.log(this.dstContent);
			} else {
				break;
			}
		}
	}

	display() : string {
		return this.dstContent;
	}
}

// let cb = new CodeBricklayer("...\n$< ${a}> ${b} $<sss${c}>\n...\n---\n,\na,b,c\n1,2\n4,5,6\n");
// cb.archPrase();
// cb.bricklay();