// Serves Monaco from the site's own bundle instead of cdn.jsdelivr.net.
//
// Browser-only. Import this module with a dynamic import() from code that
// never runs on the server (see LazyJsonEditor): monaco-editor touches
// `window`/`document` when it is evaluated, and a static import would put
// all of Monaco into the importing page's initial bundle.
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';

// The bundled (ESM) build of Monaco has to be told how to start its web
// workers; the CDN build did this by itself. Each `new Worker(new URL(...))`
// is emitted as its own file and only downloaded when that language is used.
(self as unknown as {
  MonacoEnvironment?: { getWorker(workerId: string, label: string): Worker };
}).MonacoEnvironment = {
  getWorker(_workerId: string, label: string): Worker {
    if (label === 'json') {
      return new Worker(
        new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url)
      );
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new Worker(
        new URL('monaco-editor/esm/vs/language/css/css.worker', import.meta.url)
      );
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new Worker(
        new URL('monaco-editor/esm/vs/language/html/html.worker', import.meta.url)
      );
    }
    if (label === 'typescript' || label === 'javascript') {
      return new Worker(
        new URL('monaco-editor/esm/vs/language/typescript/ts.worker', import.meta.url)
      );
    }
    return new Worker(
      new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url)
    );
  },
};

// Hand the bundled instance to @monaco-editor/react. This must run before the
// first <Editor> mounts; after this the loader no longer requests jsDelivr.
loader.config({ monaco });
