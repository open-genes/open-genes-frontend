// Publications Search API makes request to PlumX API and sends back its response
// TODO:

// PlumX categorizes metrics into 5 separate types: Usage, Captures, Mentions,
// Social Media, and Citations. Examples of each type are:
// Usage - clicks, downloads, views, library holdings, video plays
// Captures - bookmarks, code forks, favorites, readers, watchers
// Mentions - blog posts, comments, reviews, Wikipedia links
// Social media - +1s, likes, shares, Tweets
// Citations - PubMed Central, Scopus, USPTO

type doi = string; // The following two types are not so important for typing but documentation
type pmid = string;

interface Identifier<T> {
  link: T;
  value: string;
}

interface CounterGroup {
  count_types: Counters[];
  '1year_rank': number;
  total: number;
  name: CounterName;
  '3year_rank': number;
}

interface Counters {
  sources: Counter[];
  total: number;
  name: string;
}

type Counter = Omit<Counters, 'sources'> & {
  uri: string;
};

type CounterName = 'ABSTRACT_VIEWS' | 'READER_COUNT' | 'CITED_BY_COUNT' | string;
type DocumentType = 'ARTIFACT' | string;
type ArtifactType = 'ARTICLE' | 'PAPER' | 'REVIEW' | string;

export interface ArticleData {
  identifier: {
    pmid: Identifier<doi>[];
    doi: Identifier<pmid>[];
    url_id: string[];
  };
  most_recent_metrics_evidence: any;
  plum_print_counts: {
    usage: Counter;
    capture: Counter;
    citation: Counter;
  };
  request_id: doi;
  artifact_type: ArtifactType;
  sort_count: {
    usage: CounterGroup;
    capture: CounterGroup;
    citation: CounterGroup;
  };
  document_type: DocumentType;
  bibliographic_data: {
    publisher: string;
    artifact_title: string;
    start_page: number; // some id
    description: string;
    tags: string[];
    issn: string;
    publication_title: string;
    publication_year: string;
    volume: string;
    page_range: string;
    authors: string[];
    publication_date: string;
    issue: string;
    end_page: string;
  };
  id: string; // hash id
}
