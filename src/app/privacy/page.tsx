import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '쿠팡 최저가 서비스의 개인정보처리방침입니다.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">개인정보처리방침</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 mb-6">
          시행일자: {new Date().toLocaleDateString('ko-KR')}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            1. 개인정보의 처리 목적
          </h2>
          <p className="text-gray-600 leading-relaxed">
            &quot;쿠팡 최저가&quot;(이하 &quot;서비스&quot;)는 다음의 목적을 위하여
            개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의
            용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를
            받는 등 필요한 조치를 이행할 예정입니다.
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
            <li>회원 가입 및 관리</li>
            <li>가격 알림 서비스 제공</li>
            <li>관심 상품 저장 및 관리</li>
            <li>서비스 개선 및 통계 분석</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            2. 수집하는 개인정보 항목
          </h2>
          <p className="text-gray-600 leading-relaxed">
            서비스는 회원가입, 서비스 이용 등을 위해 아래와 같은 개인정보를
            수집하고 있습니다.
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
            <li>
              <strong>필수 항목:</strong> 이메일 주소, 비밀번호
            </li>
            <li>
              <strong>선택 항목:</strong> 닉네임, 프로필 이미지
            </li>
            <li>
              <strong>자동 수집 항목:</strong> 접속 로그, 쿠키, 접속 IP 정보
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            3. 개인정보의 보유 및 이용 기간
          </h2>
          <p className="text-gray-600 leading-relaxed">
            서비스는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보
            수집 시에 동의 받은 개인정보 보유·이용기간 내에서 개인정보를
            처리·보유합니다.
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
            <li>회원 정보: 회원 탈퇴 시까지</li>
            <li>관심 상품 정보: 삭제 요청 시까지</li>
            <li>접속 로그: 3개월</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            4. 개인정보의 제3자 제공
          </h2>
          <p className="text-gray-600 leading-relaxed">
            서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
            다만, 아래의 경우에는 예외로 합니다.
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            5. 쿠키(Cookie)의 사용
          </h2>
          <p className="text-gray-600 leading-relaxed">
            서비스는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 이용정보를
            저장하고 수시로 불러오는 &apos;쿠키(cookie)&apos;를 사용합니다. 쿠키는
            웹사이트를 운영하는데 이용되는 서버가 이용자의 브라우저에게 보내는 아주
            작은 텍스트 파일로 이용자의 컴퓨터에 저장됩니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            6. 개인정보 보호책임자
          </h2>
          <p className="text-gray-600 leading-relaxed">
            서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와
            관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보
            보호책임자를 지정하고 있습니다.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg mt-4">
            <p className="text-gray-600">
              <strong>개인정보 보호책임자</strong>
              <br />
              이메일: privacy@example.com
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            7. 쿠팡 파트너스 관련 안내
          </h2>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              본 서비스는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를
              제공받습니다. 이는 구매자에게 추가 비용을 발생시키지 않습니다.
              <br /><br />
              서비스에서 제공하는 상품 정보 및 가격은 쿠팡 파트너스 API를 통해
              제공받으며, 실제 쿠팡 사이트의 정보와 차이가 있을 수 있습니다.
              정확한 정보는 쿠팡 사이트에서 확인해 주시기 바랍니다.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            8. 개인정보처리방침의 변경
          </h2>
          <p className="text-gray-600 leading-relaxed">
            이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경
            내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터
            공지사항을 통하여 고지할 것입니다.
          </p>
        </section>
      </div>
    </div>
  );
}
