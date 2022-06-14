import type { Editor } from '@mantine/rte';

// credits to @corgus: https://github.com/quilljs/quill/issues/163#issuecomment-561341501
const isEditorEmpty = (editor: Editor.UnprivilegedEditor) => {
	/* 
		We don't want to inmediately check text length to determine if it's empty because we might give a false positive if there's images, videos, formulas, etc. inserted.
	 	Note: it might look like we might give a false positive if there's only images/video/formulas inserted because there might be only one op, but the truth is that when one of those is inserted, there will always be at least two ops. */
	if ((editor.getContents()['ops'] || []).length > 1) {
		return false;
	}
	return editor.getText().trim().length === 0;
};

export default isEditorEmpty;
