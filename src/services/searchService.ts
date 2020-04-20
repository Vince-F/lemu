import MiniSearch from "minisearch";

export class SearchService {
  public static addDocumentsToIndex(elements: any[]) {
    const indexableElements: any[] = this.getIndexableElments(elements);
    const indexer = new MiniSearch({
      fields: this.extractKeys(indexableElements),
      idField: 'label',
      storeFields: ['label', "_index"],
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
              weightedResults.get(result.id).score < result.score ||
              !weightedResults.has(result.id)) {
            weightedResults.set(result.id, {score: result.score, index: result._index });
          }
        });
      });
      const finalResults: Array<{label: string,
          score: number, index: number }> = [];
      weightedResults.forEach(({score, index}: {score: number, index: number}, label: string) => {
        finalResults.push({label, score, index});
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

  private static extractKeys(elements: any[]): string[] {
    const keys: Set<string> = new Set();
    elements.forEach((element) => {
      Object.keys(element).forEach((key) => {
        if (key !== "_index") {
          keys.add(key);
        }
      });
    });
    return Array.from(keys);
  }

  private static getIndexableElments(elements: any[]) {
    return elements.map((entry, idx) => {
      const indexableData: any = {
        _index: idx
      };
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
  }
}
