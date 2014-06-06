require 'faraday'

class Zotero
  
  attr_reader :options

  def initialize(options = {})
    @options = options
  end

  def connection
    @connection ||= Faraday.new(url: 'https://api.zotero.org') do |f|
      f.headers['Zotero-API-Version'] = '2'
      f.adapter Faraday.default_adapter
    end
  end

  def get(path, params = {}, &block)
    connection.get(path, options.merge(params), &block)
  end
end
