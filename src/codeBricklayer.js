"use strict";
/**
 * Author: Siyuan Liu
 * Date    : 3/28/2023
 * Purpose:
 * 	Reduce coding time.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeBricklayer = void 0;
var dns_1 = require("dns");
var CodeBricklayer = /** @class */ (function () {
    function CodeBricklayer(src) {
        this.srcContent = src;
        this.dstContent = "";
        this.relay = src;
        this.codeArch = "";
    }
    CodeBricklayer.prototype.readline = function () {
        var line = this.relay.match(/.*\n/);
        if (line === null) {
            return dns_1.EOF;
        }
        this.relay = this.relay.replace(/.*\n/, "");
        return line[0];
    };
    CodeBricklayer.prototype.archPrase = function () {
        var reArch = /\.\.\./;
        var line;
        while (true) {
            line = this.readline();
            if (line === dns_1.EOF) {
                return;
            }
            if (line.match(reArch)) {
                break;
            }
        }
        while (true) {
            line = this.readline();
            if (line === dns_1.EOF) {
                break;
            }
            if (!line.match(reArch)) {
                this.codeArch += line;
            }
            else {
                break;
            }
        }
        // console.log(this.codeArch);
    };
    CodeBricklayer.prototype.bricklay = function () {
        var line;
        var reBrick = /---/;
        var reCond = /\$<.+?>/g;
        var separator;
        var match;
        this.relay = this.srcContent;
        while (true) {
            line = this.readline();
            if (line === dns_1.EOF) {
                return;
            }
            if (line.match(reBrick)) {
                break;
            }
        }
        /* Get the Specified separator. */
        separator = this.readline();
        if (separator === dns_1.EOF) {
            return;
        }
        separator = separator.replace("\n", "");
        // console.log(separator);
        /* Get the identifier of the brick */
        line = this.readline();
        if (line === dns_1.EOF) {
            return;
        }
        line = line.replace("\n", "");
        var ids = line.split(separator);
        // console.log(ids);
        /* Code bricklayer start working. */
        while (true) {
            line = this.readline();
            line = line.replace("\n", "");
            if (line === dns_1.EOF) {
                break;
            }
            if (!line.match(reBrick)) {
                var bricks = line.split(separator);
                var num = bricks.length;
                // console.log(bricks, num);
                var code = this.codeArch;
                /* Process $<> */
                var condBlk = code.match(reCond);
                // console.log(condBlk);
                if (condBlk) {
                    for (var i = 0; i < (condBlk === null || condBlk === void 0 ? void 0 : condBlk.length); i++) {
                        var oldBlk = condBlk[i];
                        var newBlk = condBlk[i];
                        var match = false;
                        for (var j = 0; j < ids.length; j++) {
                            var id = "${".concat(ids[j], "}");
                            var exist = newBlk.indexOf(id);
                            if (exist < 0) {
                                continue;
                            }
                            if (j < num) {
                                newBlk = newBlk.replace(id, bricks[j]);
                                match = true;
                            }
                            else {
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
                    var id = "${".concat(ids[i], "}");
                    if (i < num) {
                        code = code.replace(id, bricks[i]);
                    }
                    else {
                        code = code.replace(id, "");
                    }
                }
                this.dstContent += code;
                // console.log(this.dstContent);
            }
            else {
                break;
            }
        }
    };
    CodeBricklayer.prototype.display = function () {
        return this.dstContent;
    };
    return CodeBricklayer;
}());
exports.CodeBricklayer = CodeBricklayer;
// let cb = new CodeBricklayer("...\n$< ${a}> ${b} $<sss${c}>\n...\n---\n,\na,b,c\n1,2\n4,5,6\n");
// cb.archPrase();
// cb.bricklay();
