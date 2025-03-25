import XLSX from "xlsx-js-style";
/**
 * Converts data from x-spreadsheet to SheetJS
 *
 * @param  {Object[]} sdata An x-spreadsheet data object
 * @param  {Boolean} [keepMerges=false] Does the conversion keep merged cells? (default: false)
 * @param  {Boolean} [keepFormulas=false] Does the conversion keep formulas (=true) or result value (=false)? (default: false)
 *
 * @returns {Object} A SheetJS workbook object
 */
export function xtos(sdata, keepMerges = true, keepFormulas = true) {
  function transformStyle(styleObj) {
    const result = {};
    if (styleObj)
      Object.keys(styleObj).map((key) => {
        switch (key) {
          case "align":
            result["alignment"] = Object.assign(result["alignment"] || {}, {
              horizontal: styleObj[key],
            });
            break;
          case "valign":
            result["alignment"] = Object.assign(result["alignment"] || {}, {
              vertical: styleObj[key],
            });
            break;
          case "font":
            result["font"] = Object.assign(result["font"] || {}, styleObj[key]);
            if (result["font"] && result["font"]["size"])
              result["font"] = Object.assign(result["font"] || {}, {
                sz: styleObj[key]["size"],
              });
            break;
          case "underline":
            result["font"] = Object.assign(result["font"] || {}, {
              underline: styleObj[key],
            });
            break;
          case "strike":
            result["font"] = Object.assign(result["font"] || {}, {
              strike: styleObj[key],
            });
            break;
          case "color":
            result["font"] = Object.assign(result["font"] || {}, {
              color: { rgb: styleObj[key].slice(1) },
            });
            break;
          case "bgcolor":
            // result["fill"] = Object.assign((result["fill"] || {}), { bgColor: { rgb: styleObj[key].slice(1) },patternType:"solid" });
            result["fill"] = Object.assign(result["fill"] || {}, {
              fgColor: { rgb: styleObj[key].slice(1) },
              patternType: "solid",
            });
            break;
          case "border":
            result["border"] = Object.assign(result["border"] || {}, {
              top: styleObj[key]["top"]
                ? {
                    style: styleObj[key]["top"][0],
                    color: { rgb: styleObj[key]["top"][1].slice(1) },
                  }
                : null,
              bottom: styleObj[key]["bottom"]
                ? {
                    style: styleObj[key]["bottom"][0],
                    color: { rgb: styleObj[key]["bottom"][1].slice(1) },
                  }
                : null,
              left: styleObj[key]["left"]
                ? {
                    style: styleObj[key]["left"][0],
                    color: { rgb: styleObj[key]["left"][1].slice(1) },
                  }
                : null,
              right: styleObj[key]["right"]
                ? {
                    style: styleObj[key]["right"][0],
                    color: { rgb: styleObj[key]["right"][1].slice(1) },
                  }
                : null,
            });
            break;
          case "textwrap":
            result["alignment"] = Object.assign(result["alignment"] || {}, {
              wrapText: styleObj[key],
            });
            break;
          default:
        }
      });
    return result;
  }
  function formatText(styleObj) {
    let format = "";
    if (styleObj)
      Object.keys(styleObj).map((key) => {
        if ("format" === key) {
          switch (styleObj[key]) {
            case "scientific":
              format = "0.00E+0";
              break;
            case "percent":
              format = "0.00%";
              break;
            case "number":
              format = "0.00";
              break;
            default:
          }
        }
      });
    return format;
  }
  const out = XLSX.utils.book_new();
  sdata.forEach((xws) => {
    const ws = {};
    const rowobj = xws.rows;
    let minCoord = { r: 0, c: 0 },
      maxCoord = { r: 0, c: 0 };
    for (let ri = 0; ri < rowobj.len; ++ri) {
      const row = rowobj[ri];
      if (!row) continue;

      Object.keys(row.cells).forEach((k) => {
        const idx = +k;
        if (isNaN(idx)) return;

        const lastRef = XLSX.utils.encode_cell({ r: ri, c: idx });
        if (minCoord === undefined) {
          minCoord = { r: ri, c: idx };
        } else {
          if (ri < minCoord.r) minCoord.r = ri;
          if (idx < minCoord.c) minCoord.c = idx;
        }
        if (maxCoord === undefined) {
          maxCoord = { r: ri, c: idx };
        } else {
          if (ri > maxCoord.r) maxCoord.r = ri;
          if (idx > maxCoord.c) maxCoord.c = idx;
        }

        let cellText = row.cells[k].text,
          type = "s";
        if (!cellText) {
          cellText = "";
          // keep style and format
          const styleIndex = row.cells[k].style;
          if (undefined === styleIndex || null === styleIndex) {
            type = "z"; // type 'z' will not export style
          }
          if (
            undefined !== styleIndex &&
            xws.styles[styleIndex]["format"] &&
            "scientific" === xws.styles[styleIndex]["format"]
          ) {
            cellText = 0;
            type = "n";
          }
        } else if (!isNaN(parseFloat(cellText))) {
          cellText = parseFloat(cellText);
          type = "n";
        } else if (cellText === "true" || cellText === "false") {
          cellText = Boolean(cellText);
          type = "b";
        }
        ws[lastRef] = {
          v: cellText,
          t: type,
          z: formatText(xws.styles[row.cells[k].style]),
          s: transformStyle(xws.styles[row.cells[k].style]),
        };

        if (keepFormulas && type === "s" && cellText[0] === "=") {
          ws[lastRef].f = cellText.slice(1);
        }

        if (keepMerges && row.cells[k].merge !== undefined) {
          if (ws["!merges"] === undefined) ws["!merges"] = [];

          ws["!merges"].push({
            s: {
              r: ri,
              c: idx,
            },
            e: {
              r: ri + row.cells[k].merge[0],
              c: idx + row.cells[k].merge[1],
            },
          });
        }
      });
      ws["!ref"] =
        XLSX.utils.encode_cell({ r: minCoord.r, c: minCoord.c }) +
        ":" +
        XLSX.utils.encode_cell({ r: maxCoord.r, c: maxCoord.c });
    }
    XLSX.utils.book_append_sheet(out, ws, xws.name);
  });
  return out;
}
