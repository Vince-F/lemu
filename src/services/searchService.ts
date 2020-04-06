import MiniSearch from "minisearch";

export class SearchService {
  public static addDocumentsToIndex(elements: any[]) {
    const indexableElements: any[] = elements.map((entry) => {
      const indexableData: any = {};
      for (const key of Object.keys(entry)) {
        if (typeof entry[key] === "string") {
          indexableData[key] = entry[key];
        } else if (Array.isArray(entry[key])) {
          indexableData[key] = entry[key].filter((value: any) => {
            return typeof value === "string";
          }).join(" ");
        }
      }
      return indexableData;
    });
    const indexer = new MiniSearch({
      fields: this.extractKeys(indexableElements),
      idField: 'label',
      storeFields: ['label'],
      searchOptions: {
        fuzzy: 0.2
      }
    });
    indexer.addAll(indexableElements);
    this.indexer = indexer;
  }

  public static search(keyword: string) {
    if (this.indexer) {
      const suggestedKeywords = this.indexer.autoSuggest(keyword).map((suggestion) => {
        return suggestion.suggestion;
      });
      const weightedResults = new Map();
      suggestedKeywords.forEach((suggestion) => {
        const results = this.indexer.search(suggestion);
        results.forEach((result) => {
          if (weightedResults.has(result.id) &&
              weightedResults.get(result.id) < result.score ||
              !weightedResults.has(result.id)) {
            weightedResults.set(result.id, result.score);
          }
        });
      });
      const finalResults: Array<{label: string, score: number}> = [];
      weightedResults.forEach((score: number, label: string) => {
        finalResults.push({label, score});
      });
      return finalResults.sort((a, b) => {
        return b.score - a.score;
      }).map((entry) => entry.label);
    } else {
      return [];
    }
  }

  private static indexer: MiniSearch;

  private static extractKeys(elements: any[]): string[] {
    const keys: Set<string> = new Set();
    elements.forEach((element) => {
      Object.keys(element).forEach((key) => {
        keys.add(key);
      });
    });
    return Array.from(keys);
  }
}
