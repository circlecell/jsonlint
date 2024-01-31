import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const markdownDirectory = path.join(process.cwd(), 'markdown')

function getAllMarkdownFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir)

    files.forEach(file => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            fileList = getAllMarkdownFiles(path.join(dir, file), fileList)
        } else if (file.endsWith('.md')) {
            const filePath = path.join(dir, file)
            fileList.push(filePath)
        }
    })

    return fileList
}

export async function getStaticPaths() {
    const markdownFiles = getAllMarkdownFiles(markdownDirectory)
    const slugs = markdownFiles.map(file => {
        const relativePath = path.relative(markdownDirectory, file)
        return relativePath.replace('.md', '').split(path.sep)
    })
	
    return {
        paths: slugs.map(slug => ({ params: { slug: slug } })),
        fallback: false
    }
}

export async function getStaticProps({ params }) {
	
	const slugPath = params.slug.join('/')
    const fullPath = path.join(markdownDirectory, `${slugPath}.md`)

    if (!fs.existsSync(fullPath)) {
        return { notFound: true }
    }

	const fileContents = fs.readFileSync(fullPath, 'utf8')
	const { data, content } = matter(fileContents)
	const contentWithEnv = content.replace(/%%NEXT_PUBLIC_BASE_URL%%/g, process.env.NEXT_PUBLIC_BASE_URL)
	const processedContent = await remark().use(html).process(contentWithEnv)
	const contentHtml = processedContent.toString()

	const metaTags = []
	if (data.description) {
		metaTags.push({
			attribute: 'name',
			value: 'description',
			content: data.description
		})
	}
	
	const datasetsDirectory = path.join(markdownDirectory, 'datasets')
	const datasetFiles = getAllMarkdownFiles(datasetsDirectory)

	const allDatasets = datasetFiles.map(filePath => {
	    const relativePath = path.relative(datasetsDirectory, filePath)
	    const slug = relativePath.replace('.md', '').replace(path.sep, '/')
	    const displayName = slug.split('/').pop().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
	    return { slug, displayName }
	})

	return {
		props: {
			slug: slugPath,
			content: contentHtml,
			title: data.title,
			metaTags: metaTags,
			allDatasets: allDatasets.filter(dataset => dataset.slug !== params.slug.join('/'))
		}
	}
}

export default function Page({ slug, title, content, allDatasets }) {

	const isDatasetPage = slug.startsWith('datasets/')
	
	return (
		<div className="bg-white w-full py-14 dark:bg-slate-800">
			<div className="mx-auto max-w-3xl leading-7 text-slate-700 dark:text-slate-300 misc-content">
				<div dangerouslySetInnerHTML={{ __html: content }} />
				
				{isDatasetPage && (
				<div className="mt-20 mb-20">
	                <h3>Additional JSON Datasets</h3>
					<div className="grid grid-cols-2 gap-4">
	                    {allDatasets.map(dataset => (
	                        <a key={dataset.slug} href={`/datasets/${dataset.slug}`} className="hover:underline">
	                            {dataset.displayName}
	                        </a>
	                    ))}
	                </div>
	            </div>
				)}
				
			</div>
		</div>
	)
}