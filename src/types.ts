export class PromptClass {
  id: number
  title: string
  description: {
    general: {
      label: string
      tags: string[]
    }
    subject: {
      label: string
      tags: string[]
    }
    hair: {
      label: string
      tags: string[]
    }
    face: {
      label: string
      tags: string[]
    }
    expression: {
      label: string
      tags: string[]
    }
    clothes: {
      label: string
      tags: string[]
    }
    pose: {
      label: string
      tags: string[]
    }
  }

  constructor(id: number, title: string) {
    this.id = id
    this.title = title
    this.description = {
      general: {
        label: 'Detalhes técnicos',
        tags: ['foto de celular', 'iluminação natural', 'sem edição', 'fundo de quarto moderno'],
      },
      subject: {
        label: 'Contexto',
        tags: ['18 anos', 'estudante', 'delicada'],
      },
      hair: {
        label: 'Cabelo',
        tags: ['longo', 'preto', 'liso com ondas nas pontas', 'franja reta'],
      },
      face: {
        label: 'Rosto',
        tags: [
          'pele pálida',
          'delineador preto',
          'sombra esfumada',
          'sobrancelhas arqueadas',
          'lábios volumosos com batom preto',
          'nariz pequeno',
          'piercing no septo',
        ],
      },
      expression: {
        label: 'Expressão',
        tags: ['neutra ou indiferente'],
      },
      clothes: {
        label: 'Roupas',
        tags: ['moletom preto oversized', 'pulseira preta', 'colar de corrente com coração'],
      },
      pose: {
        label: 'Pose',
        tags: ['segurando celular', 'pose casual', 'levemente inclinada'],
      },
    }
  }
}
