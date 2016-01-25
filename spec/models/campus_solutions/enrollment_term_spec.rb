describe CampusSolutions::EnrollmentTerm do
  let(:user_id) { '12348' }
  shared_examples 'a proxy that gets data' do
    subject { proxy.get }
    it_should_behave_like 'a simple proxy that returns errors'
    it_behaves_like 'a proxy that properly observes the enrollment card flag'
    it_behaves_like 'a proxy that got data successfully'
    it 'returns data with the expected structure' do
      pp subject
      expect(subject[:feed][:enrollmentTerm]).to be
    end
  end

  context 'mock proxy' do
    let(:proxy) { CampusSolutions::EnrollmentTerm.new(fake: true, user_id: user_id, term_id: '2176') }
    subject { proxy.get }
    it_should_behave_like 'a proxy that gets data'

    it 'returns specific mock data' do
      enrollment_feed = subject[:feed][:enrollmentTerm]
      expect(enrollment_feed[:studentId]).to eq '0000012'
      expect(enrollment_feed[:advisors][1][:name]).to eq 'Marsh Man'
      expect(enrollment_feed[:links][:decal][:url]).to eq 'http://www.decal.org/'
      expect(enrollment_feed[:enrollmentPeriods][0][:id]).to eq 'phase1'
      expect(enrollment_feed[:enrolledClasses][0][:id]).to eq '21786'
      expect(enrollment_feed[:waitlistedClasses][0][:id]).to eq '15636'
    end

    it 'formats dates' do
      expect(subject[:feed][:enrollmentTerm][:enrollmentPeriods][0][:datetime]).to eq(
        epoch: 1461019200,
        datetime: '2016-04-18T15:40:00-07:00',
        datestring: '4/18'
      )
    end
  end
end
