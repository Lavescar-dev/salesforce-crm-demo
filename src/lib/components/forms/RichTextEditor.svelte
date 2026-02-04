<script lang="ts">
	import { marked } from 'marked';

	interface Props {
		value?: string;
		placeholder?: string;
		rows?: number;
		disabled?: boolean;
		required?: boolean;
		class?: string;
		oninput?: (e: Event) => void;
	}

	let {
		value = '',
		placeholder = '',
		rows = 10,
		disabled = false,
		required = false,
		class: className = '',
		oninput
	}: Props = $props();

	let markdownInput = $state(value);
	let htmlOutput = $derived(marked(markdownInput || ''));

	// Sync markdownInput with the `value` prop
	$effect(() => {
		if (value !== markdownInput) {
			markdownInput = value;
		}
	});

	// Sync the `value` prop with markdownInput
	$effect(() => {
		value = markdownInput;
	});

	// Simple toolbar actions (can be expanded)
	function wrapText(before: string, after: string) {
		const textarea = document.getElementById('richtext-editor') as HTMLTextAreaElement;
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selectedText = textarea.value.substring(start, end);

		markdownInput =
			textarea.value.substring(0, start) + before + selectedText + after + textarea.value.substring(end, textarea.value.length);

		// Manually trigger input event for reactivity
		if (oninput) {
			textarea.value = markdownInput; // Ensure textarea value is updated
			textarea.dispatchEvent(new Event('input', { bubbles: true }));
		}
		// Restore selection
		textarea.focus();
		textarea.selectionStart = start + before.length;
		textarea.selectionEnd = end + before.length;
	}

	function addLink() {
		const url = prompt('Enter URL:');
		if (url) {
			wrapText('[', `](${url})`);
		}
	}
	function addImage() {
		const url = prompt('Enter Image URL:');
		if (url) {
			wrapText('![alt text](', `)`);
		}
	}
</script>

<div class="richtext-editor-container ${className}">
	<div class="toolbar flex gap-1 p-1 border border-salesforce-gray-300 rounded-t-lg bg-salesforce-gray-100">
		<button type="button" class="btn-toolbar" onclick={() => wrapText('**', '**')} title="Bold">
			<span class="font-bold">B</span>
		</button>
		<button type="button" class="btn-toolbar" onclick={() => wrapText('*', '*')} title="Italic">
			<span class="italic">I</span>
		</button>
		<button type="button" class="btn-toolbar" onclick={() => wrapText('## ', '')} title="Heading 2">
			<span>H2</span>
		</button>
		<button type="button" class="btn-toolbar" onclick={() => wrapText('```\n', '\n```')} title="Code Block">
			<span>{`</>`}</span>
		</button>
		<button type="button" class="btn-toolbar" onclick={addLink} title="Link">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.71"/></svg>
		</button>
		<button type="button" class="btn-toolbar" onclick={addImage} title="Image">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
		</button>
	</div>
	<textarea
		id="richtext-editor"
		bind:value={markdownInput}
		{placeholder}
		{rows}
		{disabled}
		{required}
		class="w-full p-2 border-x border-b border-salesforce-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-salesforce-blue-500 focus:border-transparent resize-y"
		oninput={oninput}
	></textarea>
	<div class="preview mt-4 p-4 border border-salesforce-gray-300 rounded-lg bg-salesforce-gray-50 prose max-w-none">
		{@html htmlOutput}
	</div>
</div>

<style>
	.btn-toolbar {
		@apply px-2 py-1 text-sm bg-white border border-salesforce-gray-300 rounded hover:bg-salesforce-gray-50;
	}
	/* Basic prose styling for markdown output */
	.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
		@apply font-bold mt-4 mb-2;
	}
	.prose h1 { @apply text-2xl; }
	.prose h2 { @apply text-xl; }
	.prose h3 { @apply text-lg; }
	.prose p {
		@apply mb-2;
	}
	.prose ul, .prose ol {
		@apply list-inside mb-2 pl-5;
	}
	.prose ul {
		@apply list-disc;
	}
	.prose ol {
		@apply list-decimal;
	}
	.prose a {
		@apply text-salesforce-blue-500 hover:underline;
	}
	.prose code {
		@apply bg-salesforce-gray-200 px-1 py-0.5 rounded text-sm;
	}
	.prose pre {
		@apply bg-salesforce-gray-800 text-white p-3 rounded-lg overflow-x-auto;
	}
</style>
