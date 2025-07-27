// 项目内容数据管理文件
export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'image-text';
  content?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
  title?: string;
}

export interface ProjectContent {
  projectId: number;
  blocks: ContentBlock[];
}

// 项目详细内容数据
export const projectContentData: ProjectContent[] = [
  {
    projectId: 1,
    blocks: [
      {
        id: 'intro-text',
        type: 'text',
        content: '在北京 751 园区的历史工业遗址中，Yatofu 受委托设计AITASHOP 全新数字空间。设计师以"The Future Ruin未来之墟"作为空间概念，借助时间与记忆的寓意，在曾经的冒险化工厂建筑中引入当代设计语言。通过概念化的空间重塑、装置构架、让现行文化的当代精神与工业遗存开启一场关于空间、社群与感知的对话。'
      },
      {
        id: 'main-image-1',
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        imageAlt: '比达达利公园外观',
        imageCaption: '© Wen Studio'
      },
      {
        id: 'design-concept',
        type: 'text',
        content: '设计概念源于对工业遗址历史文脉的深度理解和当代功能需求的平衡。建筑师保留了原有工业建筑的结构特征，同时注入现代设计元素，创造出一个既具有历史厚重感又充满未来感的空间。绿植墙面的运用不仅美化了环境，更象征着自然与工业的和谐共存。'
      },
      {
        id: 'interior-image',
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        imageAlt: '内部空间设计',
        imageCaption: '内部空间展现了工业风格与现代设计的完美融合'
      },
      {
        id: 'material-analysis',
        type: 'text',
        content: '材料的选择体现了设计师对可持续发展的思考。回收的工业材料与新型环保材料的结合使用，不仅降低了建造成本，更体现了对环境的尊重。裸露的混凝土结构与精致的金属装饰形成对比，营造出独特的空间氛围。'
      },
      {
        id: 'detail-image',
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        imageAlt: '建筑细部',
        imageCaption: '精心设计的建筑细部展现了工艺的精湛'
      }
    ]
  },
  {
    projectId: 2,
    blocks: [
      {
        id: 'intro-text',
        type: 'text',
        content: '这个创新的办公空间设计融合了现代建筑美学与功能性需求。设计师通过开放式布局和自然光线的巧妙运用，创造出一个既专业又舒适的工作环境。空间中的每个细节都体现了对员工福祉和工作效率的深度考虑。'
      },
      {
        id: 'main-image-1',
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Apricity 开发品牌总部外观',
        imageCaption: '© Studio A'
      },
      {
        id: 'office-concept',
        type: 'text',
        content: '办公空间的设计理念强调灵活性和协作性。开放式的工作区域配备了可移动的隔断系统，员工可以根据工作需要调整空间配置。大面积的玻璃幕墙确保了充足的自然采光，同时提供了良好的城市景观视野。'
      },
      {
        id: 'workspace-image',
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        imageAlt: '办公空间内部',
        imageCaption: '开放式办公区域促进了团队协作'
      }
    ]
  },
  // 可以继续添加更多项目的内容...
];

// 根据项目ID获取内容的工具函数
export const getProjectContent = (projectId: number): ContentBlock[] => {
  const project = projectContentData.find(p => p.projectId === projectId);
  return project ? project.blocks : [];
};

// 添加新内容块的工具函数
export const addContentBlock = (projectId: number, block: ContentBlock): void => {
  const projectIndex = projectContentData.findIndex(p => p.projectId === projectId);
  if (projectIndex !== -1) {
    projectContentData[projectIndex].blocks.push(block);
  } else {
    projectContentData.push({
      projectId,
      blocks: [block]
    });
  }
};
