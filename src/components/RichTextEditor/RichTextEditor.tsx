import React, { useState, useRef, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image
} from 'lucide-react';
import './RichTextEditor.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = '请输入内容...',
  onImageUpload
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  }, [onChange]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
  };

  const handleFormat = (format: string) => {
    switch (format) {
      case 'bold':
        execCommand('bold');
        break;
      case 'italic':
        execCommand('italic');
        break;
      case 'underline':
        execCommand('underline');
        break;
      case 'h1':
        execCommand('formatBlock', '<h1>');
        break;
      case 'h2':
        execCommand('formatBlock', '<h2>');
        break;
      case 'h3':
        execCommand('formatBlock', '<h3>');
        break;
      case 'p':
        execCommand('formatBlock', '<p>');
        break;
      case 'ul':
        execCommand('insertUnorderedList');
        break;
      case 'ol':
        execCommand('insertOrderedList');
        break;
      case 'justifyLeft':
        execCommand('justifyLeft');
        break;
      case 'justifyCenter':
        execCommand('justifyCenter');
        break;
      case 'justifyRight':
        execCommand('justifyRight');
        break;
      case 'justifyFull':
        execCommand('justifyFull');
        break;
    }
  };

  const handleLinkInsert = () => {
    const url = prompt('请输入链接地址:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleImageInsert = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onImageUpload) return;

    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('图片大小不能超过10MB');
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await onImageUpload(file);
      execCommand('insertImage', imageUrl);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('图片上传失败，请重试');
    } finally {
      setIsUploading(false);
      // 重置文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePaste = async (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items || !onImageUpload) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        event.preventDefault();
        const file = item.getAsFile();
        if (file) {
          setIsUploading(true);
          try {
            const imageUrl = await onImageUpload(file);
            execCommand('insertImage', imageUrl);
          } catch (error) {
            console.error('Image upload failed:', error);
            alert('图片上传失败，请重试');
          } finally {
            setIsUploading(false);
          }
        }
        break;
      }
    }
  };

  const isCommandActive = (command: string): boolean => {
    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  };

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-btn ${isCommandActive('bold') ? 'active' : ''}`}
            onClick={() => handleFormat('bold')}
            title="粗体"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            className={`toolbar-btn ${isCommandActive('italic') ? 'active' : ''}`}
            onClick={() => handleFormat('italic')}
            title="斜体"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            className={`toolbar-btn ${isCommandActive('underline') ? 'active' : ''}`}
            onClick={() => handleFormat('underline')}
            title="下划线"
          >
            <Underline size={16} />
          </button>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <select
            className="format-select"
            onChange={(e) => handleFormat(e.target.value)}
            value=""
          >
            <option value="">格式</option>
            <option value="h1">标题 1</option>
            <option value="h2">标题 2</option>
            <option value="h3">标题 3</option>
            <option value="p">正文</option>
          </select>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-btn ${isCommandActive('insertUnorderedList') ? 'active' : ''}`}
            onClick={() => handleFormat('ul')}
            title="无序列表"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            className={`toolbar-btn ${isCommandActive('insertOrderedList') ? 'active' : ''}`}
            onClick={() => handleFormat('ol')}
            title="有序列表"
          >
            <ListOrdered size={16} />
          </button>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-btn ${isCommandActive('justifyLeft') ? 'active' : ''}`}
            onClick={() => handleFormat('justifyLeft')}
            title="左对齐"
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            className={`toolbar-btn ${isCommandActive('justifyCenter') ? 'active' : ''}`}
            onClick={() => handleFormat('justifyCenter')}
            title="居中对齐"
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            className={`toolbar-btn ${isCommandActive('justifyRight') ? 'active' : ''}`}
            onClick={() => handleFormat('justifyRight')}
            title="右对齐"
          >
            <AlignRight size={16} />
          </button>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={handleLinkInsert}
            title="插入链接"
          >
            <Link size={16} />
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={handleImageInsert}
            disabled={isUploading || !onImageUpload}
            title="插入图片"
          >
            {isUploading ? <span>⏳</span> : <Image size={16} />}
          </button>
        </div>
      </div>

      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={handleContentChange}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {isUploading && (
        <div className="upload-overlay">
          <div className="upload-message">
            正在上传图片...
          </div>
        </div>
      )}
    </div>
  );
};
