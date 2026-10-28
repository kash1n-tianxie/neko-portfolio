import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createRequire } from 'node:module'
import { runInThisContext } from 'node:vm'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'

const require = createRequire(import.meta.url)

// Keep project components real. Only adapt Next's request/router boundary to the
// locale selected by a test; React hooks and image rendering still run normally.
export function componentLoader(locale) {
  const cache = new Map()
  const messages = JSON.parse(readFileSync(resolve(`messages/${locale}.json`), 'utf8'))
  const translate = (namespace) => (key) => messages[namespace]?.[key] ?? key
  function load(path) {
    path = resolve(path)
    if (cache.has(path)) return cache.get(path).exports
    const loadedModule = { exports: {} }
    cache.set(path, loadedModule)
    const localRequire = (specifier) => {
      if (specifier.endsWith('.css')) return {}
      if (specifier === '@/i18n/navigation') return {
        Link: ({ href, children, ...props }) => React.createElement('a', {
          ...props, href: `${locale === 'en' ? '/en' : ''}${href}`,
        }, children),
      }
      if (specifier === 'next-intl/server') return {
        getLocale: async () => locale,
        setRequestLocale: () => {},
        getTranslations: async (namespace) => translate(namespace),
      }
      if (specifier === 'next-intl') return {
        useLocale: () => locale,
        useTranslations: translate,
      }
      if (specifier.startsWith('.') || specifier.startsWith('@/')) {
        const base = specifier.startsWith('@/') ? resolve('src', specifier.slice(2)) : resolve(dirname(path), specifier)
        const target = [base, `${base}.ts`, `${base}.tsx`].find((candidate) => existsSync(candidate))
        if (!target) throw new Error(`Cannot resolve ${specifier} from ${path}`)
        return load(target)
      }
      return require(specifier)
    }
    const { outputText } = ts.transpileModule(readFileSync(path, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    })
    runInThisContext(`(function(require,module,exports){${outputText}\n})`, { filename: path })(localRequire, loadedModule, loadedModule.exports)
    return loadedModule.exports
  }
  return load
}

async function resolveServerComponents(element) {
  if (Array.isArray(element)) return Promise.all(element.map(resolveServerComponents))
  if (!React.isValidElement(element)) return element
  if (typeof element.type === 'function' && element.type.constructor.name === 'AsyncFunction') {
    return resolveServerComponents(await element.type(element.props))
  }
  if (!element.props.children) return element
  const children = await resolveServerComponents(element.props.children)
  return React.cloneElement(element, {}, ...(Array.isArray(children) ? children : [children]))
}

export async function renderComponent(Component, props = {}) {
  return renderToStaticMarkup(await resolveServerComponents(React.createElement(Component, props)))
}
