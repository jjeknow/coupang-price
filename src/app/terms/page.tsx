import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관',
  description: '쿠팡 최저가 서비스의 이용약관입니다.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">이용약관</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 mb-6">
          시행일자: {new Date().toLocaleDateString('ko-KR')}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            제1조 (목적)
          </h2>
          <p className="text-gray-600 leading-relaxed">
            이 약관은 &quot;쿠팡 최저가&quot;(이하 &quot;서비스&quot;)가 제공하는
            가격 추적 서비스의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및
            책임사항 등을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            제2조 (정의)
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              <strong>&quot;서비스&quot;</strong>란 쿠팡 상품의 가격 변동을 추적하고
              알림을 제공하는 웹 기반 서비스를 말합니다.
            </li>
            <li>
              <strong>&quot;회원&quot;</strong>이란 서비스에 가입하여 이용계약을
              체결한 자를 말합니다.
            </li>
            <li>
              <strong>&quot;비회원&quot;</strong>이란 회원에 가입하지 않고 서비스를
              이용하는 자를 말합니다.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            제3조 (서비스의 제공)
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            서비스는 다음과 같은 기능을 제공합니다:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>쿠팡 상품 검색 및 정보 제공</li>
            <li>카테고리별 베스트 상품 정보</li>
            <li>골드박스 할인 상품 정보</li>
            <li>상품 가격 변동 추적 (회원)</li>
            <li>가격 알림 서비스 (회원)</li>
            <li>관심 상품 저장 (회원)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            제4조 (쿠팡 파트너스 관련)
          </h2>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              <strong className="text-red-600">중요 안내</strong>
              <br /><br />
              1. 본 서비스는 쿠팡 파트너스 활동의 일환으로 운영됩니다.
              <br />
              2. 서비스 내 상품 링크를 통해 구매가 이루어질 경우, 서비스 운영자는
              쿠팡으로부터 일정액의 수수료를 제공받습니다.
              <br />
              3. 이로 인해 구매자에게 추가 비용이 발생하지 않습니다.
              <br />
              4. 서비스에서 제공하는 가격 정보는 쿠팡 API를 통해 제공받으며,
              실시간으로 변동될 수 있습니다.
              <br />
              5. 정확한 가격 및 상품 정보는 쿠팡 사이트에서 직접 확인해 주시기
              바랍니다.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            제5조 (회원가입)
          </h2>
          <p className="text-gray-600 leading-relaxed">
            1. 이용자는 서비스가 정한 가입 양식에 따라 회원정보를 기입한 후
            이용약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.
            <br /><br />
            2. 서비스는 다음 각 호에 해당하는 신청에 대하여는 승낙을 거부하거나
            사후에 이용계약을 해지할 수 있습니다.
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
            <li>가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
            <li>실명이 아니거나 타인의 정보를 이용한 경우</li>
            <li>허위의 정보를 기재하거나 필수사항을 기재하지 않은 경우</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            제6조 (회원 탈퇴 및 자격 상실)
          </h2>
          <p className="text-gray-600 leading-relaxed">
            1. 회원은 서비스에 언제든지 탈퇴를 요청할 수 있으며, 서비스는 즉시
            회원탈퇴를 처리합니다.
            <br /><br />
            2. 회원이 다음 각 호에 해당하는 경우, 서비스는 회원자격을 제한 및
            정지시킬 수 있습니다.
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
            <li>가입 신청 시 허위 내용을 등록한 경우</li>
            <li>서비스를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
            <li>서비스의 운영을 고의로 방해한 경우</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            제7조 (서비스 이용의 제한)
          </h2>
          <p className="text-gray-600 leading-relaxed">
            서비스는 다음 각 호에 해당하는 경우 서비스의 전부 또는 일부를 제한하거나
            중지할 수 있습니다.
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
            <li>서비스용 설비의 보수 등 공사로 인한 부득이한 경우</li>
            <li>회원이 서비스의 운영을 방해하는 경우</li>
            <li>정전, 제반 설비의 장애 또는 이용량의 폭주 등으로 정상적인 서비스 이용에 지장이 있는 경우</li>
            <li>쿠팡 파트너스 API 서비스의 중단 또는 제한이 있는 경우</li>
            <li>기타 천재지변, 국가비상사태 등 불가항력적 사유가 있는 경우</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            제8조 (정보의 정확성)
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              1. 서비스에서 제공하는 상품 정보 및 가격은 쿠팡 파트너스 API를 통해
              제공받는 정보입니다.
              <br /><br />
              2. 서비스는 정보의 정확성을 위해 노력하나, API 통신 지연, 데이터
              갱신 주기 등으로 인해 실제 쿠팡 사이트와 차이가 발생할 수 있습니다.
              <br /><br />
              3. 최종 구매 결정 전 반드시 쿠팡 사이트에서 정확한 가격 및 상품
              정보를 확인해 주시기 바랍니다.
              <br /><br />
              4. 정보의 불일치로 인한 손해에 대해 서비스는 책임을 지지 않습니다.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            제9조 (면책조항)
          </h2>
          <p className="text-gray-600 leading-relaxed">
            1. 서비스는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력으로
            인한 서비스 제공 중단에 대해 책임을 지지 않습니다.
            <br /><br />
            2. 서비스는 회원의 귀책사유로 인한 서비스 이용의 장애에 대해 책임을
            지지 않습니다.
            <br /><br />
            3. 서비스는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에
            대하여 책임을 지지 않습니다.
            <br /><br />
            4. 서비스에서 제공하는 가격 정보를 기반으로 한 구매 결정에 대한
            책임은 회원 본인에게 있습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            제10조 (약관의 개정)
          </h2>
          <p className="text-gray-600 leading-relaxed">
            1. 서비스는 필요하다고 인정되는 경우 이 약관을 변경할 수 있으며,
            변경된 약관은 서비스 내 공지사항에 공지함으로써 효력을 발생합니다.
            <br /><br />
            2. 회원은 변경된 약관에 대해 거부할 권리가 있으며, 변경된 약관에
            이의가 있는 회원은 탈퇴를 요청할 수 있습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            제11조 (분쟁해결)
          </h2>
          <p className="text-gray-600 leading-relaxed">
            1. 서비스 이용과 관련하여 분쟁이 발생한 경우, 서비스와 회원은
            상호 협의하여 해결하도록 노력합니다.
            <br /><br />
            2. 본 약관에 명시되지 아니한 사항은 관계법령 및 상관례에 따릅니다.
          </p>
        </section>

        <section className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">부칙</h2>
          <p className="text-gray-600">
            이 약관은 {new Date().toLocaleDateString('ko-KR')}부터 시행됩니다.
          </p>
        </section>
      </div>
    </div>
  );
}
