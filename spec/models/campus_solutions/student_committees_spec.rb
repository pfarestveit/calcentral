describe CampusSolutions::StudentCommittees do

  let(:user_id) { '11417698' }

  shared_examples 'a proxy that gets data' do
    subject { proxy.get }
    it_should_behave_like 'a simple proxy that returns errors'
    it_behaves_like 'a proxy that properly observes the committees feature flag'
    it_behaves_like 'a proxy that got data successfully'
    it 'returns data with the expected structure' do
      expect(subject[:feed][:ucSrStudentCommittee]).to be
    end
  end

  context 'mock proxy' do
    let(:proxy) { CampusSolutions::StudentCommittees.new(fake: true, user_id: user_id) }
    subject { proxy.get }
    it_should_behave_like 'a proxy that gets data'
    it 'should get specific mock data' do
      expect(subject[:feed][:ucSrStudentCommittee][:emplid]).to eq '123456789'
    end
  end

end
