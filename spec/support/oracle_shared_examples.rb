# Oracle Shared Examples
# Used to provide test functionality that is shared across Oracle interfaces

shared_examples 'an Oracle driven data source' do
  let(:ucb_birthday) { DateTime.parse('1868-03-23T14:05:05-08:00') }
  let(:db_results) do
    [
      {'id' => 123, 'name' => 'Jason', 'buffalo_wings' => 'tasty'},
      {'id' => 124, 'name' => 'Paul', 'buffalo_wings' => 'veggie variety only'},
      {'id' => 125, 'name' => 'Ray', 'buffalo_wings' => 'i hate them'},
    ]
  end
  let(:row_hash) { db_results[0].dup }

  describe '.stringify_ints!' do
    it 'converts single result row' do
      subject.stringify_ints!(row_hash, ['id', 'buffalo_wings'])
      expect(row_hash['id']).to eq '123'
      expect(row_hash['buffalo_wings']).to eq 'tasty'
    end

    it 'converts array of database result rows' do
      subject.stringify_ints!(db_results, ['id', 'buffalo_wings'])
      expect(db_results[0]['id']).to eq '123'
      expect(db_results[1]['id']).to eq '124'
      expect(db_results[2]['id']).to eq '125'
      expect(db_results[0]['buffalo_wings']).to eq 'tasty'
      expect(db_results[1]['buffalo_wings']).to eq 'veggie variety only'
      expect(db_results[2]['buffalo_wings']).to eq 'i hate them'
    end
  end

  describe '.stringify_row!' do
    it 'converts specified columns as strings' do
      subject.stringify_row!(row_hash, ['id', 'buffalo_wings'])
      expect(row_hash['id']).to eq '123'
      expect(row_hash['buffalo_wings']).to eq 'tasty'
    end
  end

  describe '.stringify_column!' do
    it 'converts integer column to string' do
      subject.stringify_column!(row_hash, 'id')
      expect(row_hash['id']).to eq '123'
    end
    it 'zero pads integer string' do
      subject.stringify_column!(row_hash, 'id', 5)
      expect(row_hash['id']).to eq '00123'
    end
    it 'performs no change when column is a string' do
      subject.stringify_column!(row_hash, 'buffalo_wings')
      expect(row_hash['buffalo_wings']).to eq 'tasty'
    end
  end
end
