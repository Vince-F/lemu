import MiniSearch from "minisearch";

export class SearchService {
  public static addDocumentsToIndex(elements: Array<{[key: string]: unknown}>): void {
    const indexableElements: unknown[] = this.getIndexableElements(elements);
    const indexer = new MiniSearch({
      fields: this.extractKeys(indexableElements),
      idField: "label",
      storeFields: ["label", "_index"],
      searchOptions: {
        fuzzy: 0.2
      }
    });
    indexer.addAll(indexableElements);
    this.indexer = indexer;
  }

  public static search(keyword: string): Array<{text: string, value: number}> {
    if (this.indexer) {
      const suggestedKeywords = this.indexer.autoSuggest(keyword).map((suggestion) => {
        return suggestion.suggestion;
      });
      const weightedResults = new Map();
      suggestedKeywords.forEach((suggestion) => {
        const results = this.indexer.search(suggestion);
        results.forEach((result) => {
          if (weightedResults.has(result.id) &&
              (weightedResults.get(result.id).score < result.score ||
              !weightedResults.has(result.id))) {
            weightedResults.set(result.id, { score: result.score, index: result._index });
          }
        });
      });
      const finalResults: Array<{label: string,
          score: number, index: number }> = [];
      weightedResults.forEach(({ score, index }: {score: number, index: number}, label: string) => {
        finalResults.push({ label, score, index });
      });
      return finalResults.sort((a, b) => {
        return b.score - a.score;
      }).map((entry) => {
        return {
          text: entry.label,
          value: entry.index
        };
      });
    } else {
      return [];
    }
  }

  private static indexer: MiniSearch;

  private static extractKeys(elements: unknown[]): string[] {
    const keys: Set<string> = new Set();
    elements.forEach((element) => {
      if (typeof element === "object" && element) {
        Object.keys(element).forEach((key) => {
          if (key !== "_index") {
            keys.add(key);
          }
        });
      }
    });
    return Array.from(keys);
  }

  private static getIndexableElements(elements: Array<{[key: string]: unknown}>):
    Array<{_index: number, [key: string]: string | number}> {
    return elements.map((entry, idx) => {
      const indexableData: {_index: number, [key: string]: string | number} = {
        _index: idx
      };
      if (entry && typeof entry === "object") {
        for (const key of Object.keys(entry)) {
          const val = entry[key];
          if (val && typeof val === "string") {
            indexableData[key] = val;
          } else if (Array.isArray(val)) {
            indexableData[key] = val.filter((value: unknown) => {
              return typeof value === "string";
            }).join(" ");
          }
        }
      }
      return indexableData;
    });
  }
}
