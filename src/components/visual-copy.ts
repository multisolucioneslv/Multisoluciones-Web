export const visualCopy = {
  es: {
    benefits: [['Diseño adaptable a móviles', 'Información clara y contacto sencillo'], ['Catálogo organizado', 'Compras y pedidos en un solo lugar'], ['Procesos adaptados a tu negocio', 'Información organizada para tu equipo']],
    steps: ['Escuchamos tus objetivos y los retos de tu trabajo.', 'Elegimos las funciones que realmente necesitas.', 'Desarrollamos y comprobamos una herramienta práctica.'],
    projectAlt: ['Captura real del sitio Rescuvo', 'Ejercicio interactivo del curso Aprendiendo a Programar'],
    courseCaption: 'Ejercicio real del curso: quiz interactivo',
    serviceAlt: ['Sitio web mostrado en computadora y teléfono', 'Tienda en línea y preparación de pedidos', 'Sistema de gestión con información organizada']
  },
  en: {
    benefits: [['Mobile-friendly design', 'Clear information and easy contact'], ['An organized catalog', 'Shopping and orders in one place'], ['Processes tailored to your business', 'Organized information for your team']],
    steps: ['We listen to your goals and everyday challenges.', 'We choose the features you actually need.', 'We build and test a practical tool.'],
    projectAlt: ['Actual screenshot of the Rescuvo website', 'Interactive exercise from the learning-to-code course'],
    courseCaption: 'Actual course exercise: interactive quiz',
    serviceAlt: ['Business website on a laptop and phone', 'Online store and order preparation', 'Management system with organized information']
  },
  pt: {
    benefits: [['Design adaptado ao celular', 'Informações claras e contato fácil'], ['Catálogo organizado', 'Compras e pedidos em um só lugar'], ['Processos adaptados ao seu negócio', 'Informações organizadas para sua equipe']],
    steps: ['Ouvimos seus objetivos e os desafios do seu trabalho.', 'Escolhemos as funções de que você realmente precisa.', 'Desenvolvemos e testamos uma ferramenta prática.'],
    projectAlt: ['Captura real do site Rescuvo', 'Exercício interativo do curso de programação'],
    courseCaption: 'Exercício real do curso: quiz interativo',
    serviceAlt: ['Site em computador e celular', 'Loja virtual e preparação de pedidos', 'Sistema de gestão com informações organizadas']
  },
  ko: {
    benefits: [['모바일에 맞춘 디자인', '명확한 정보와 간편한 문의'], ['체계적인 상품 목록', '한곳에서 관리하는 구매와 주문'], ['사업에 맞춘 업무 흐름', '팀을 위한 체계적인 정보 관리']],
    steps: ['목표와 일상 업무의 어려움을 듣습니다.', '실제로 필요한 기능을 선택합니다.', '실용적인 도구를 개발하고 검증합니다.'],
    projectAlt: ['Rescuvo 웹사이트의 실제 화면', '프로그래밍 강좌의 대화형 연습'],
    courseCaption: '실제 강좌 연습: 대화형 퀴즈',
    serviceAlt: ['컴퓨터와 휴대폰의 비즈니스 웹사이트', '온라인 상점과 주문 준비', '정보를 체계적으로 정리한 관리 시스템']
  }
};

export function getVisualCopy(locale: string) {
  return visualCopy[locale as keyof typeof visualCopy] ?? visualCopy.en;
}
