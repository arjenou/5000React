import React from 'react';
import type { ContentBlock } from '../../data/projectContent';
import './ContentRenderer.css';

interface ContentRendererProps {
  blocks: ContentBlock[];
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ blocks }) => {
  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'text':
        return (
          <div key={block.id} className="content-block text-block">
            {block.title && <h3 className="block-title">{block.title}</h3>}
            <div className="text-content">
              <p>{block.content}</p>
            </div>
          </div>
        );
      
      case 'image':
        return (
          <div key={block.id} className="content-block image-block">
            <div className="image-container">
              <img 
                src={block.imageUrl} 
                alt={block.imageAlt || ''} 
                className="content-image"
                loading="lazy"
              />
              {block.imageCaption && (
                <div className="image-caption">{block.imageCaption}</div>
              )}
            </div>
          </div>
        );
      
      case 'image-text':
        return (
          <div key={block.id} className="content-block image-text-block">
            <div className="image-text-container">
              <div className="image-section">
                <img 
                  src={block.imageUrl} 
                  alt={block.imageAlt || ''} 
                  className="content-image"
                  loading="lazy"
                />
                {block.imageCaption && (
                  <div className="image-caption">{block.imageCaption}</div>
                )}
              </div>
              <div className="text-section">
                {block.title && <h3 className="block-title">{block.title}</h3>}
                <div className="text-content">
                  <p>{block.content}</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="content-renderer">
      {blocks.map(block => renderBlock(block))}
    </div>
  );
};

export default ContentRenderer;
