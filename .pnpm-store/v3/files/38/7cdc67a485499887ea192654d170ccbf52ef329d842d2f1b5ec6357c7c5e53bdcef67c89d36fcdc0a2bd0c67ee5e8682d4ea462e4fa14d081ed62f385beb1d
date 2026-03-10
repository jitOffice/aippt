import type { Options, ResolvedOptions } from '../types'
import { getVueVersion } from './utils'

export function resolveOptions(userOptions: Options): ResolvedOptions {
  const noop = () => {}

  // Resolve with new names taking precedence over deprecated old names
  const markdownOptions = userOptions.markdownOptions ?? userOptions.markdownItOptions ?? {}
  const markdownUses = userOptions.markdownUses ?? userOptions.markdownItUses ?? []
  const markdownSetup = userOptions.markdownSetup ?? userOptions.markdownItSetup ?? noop

  const defaultOptions: ResolvedOptions = {
    headEnabled: false,
    headField: '',
    frontmatter: true,
    excerpt: false,
    exposeFrontmatter: true,
    exposeExcerpt: false,
    exportFrontmatter: true,
    escapeCodeTagInterpolation: true,
    customSfcBlocks: ['route', 'i18n', 'style'],
    componentOptions: {},
    frontmatterOptions: {},
    markdownOptions: {},
    markdownUses: [],
    markdownSetup: noop,
    markdownItOptions: {},
    markdownItUses: [],
    markdownItSetup: noop,
    wrapperDiv: true,
    wrapperComponent: null,
    transforms: {},
    vueVersion: userOptions.vueVersion || getVueVersion(),
    wrapperClasses: 'markdown-body',
    include: null,
    exclude: null,
    frontmatterPreprocess: (frontmatter, options, _id, defaults) => {
      return {
        head: defaults(frontmatter, options),
        frontmatter,
      }
    },
  }

  const options = {
    ...defaultOptions,
    ...userOptions,
    // Set both old and new keys to the resolved value
    markdownOptions,
    markdownUses,
    markdownSetup,
    markdownItOptions: markdownOptions,
    markdownItUses: markdownUses,
    markdownItSetup: markdownSetup,
  }

  return options as ResolvedOptions
}
