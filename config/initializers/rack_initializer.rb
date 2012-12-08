class Fixnum
 N_BYTES = [42].pack('i').size
 N_BITS = N_BYTES * 8
 MAX = 2 ** (N_BITS - 2) - 1
 MIN = -MAX - 1
end
if Rack::Utils.respond_to?("key_space_limit=")
  Rack::Utils.key_space_limit = Fixnum::MAX
end


# ### hack deals with "RangeError: cannot parse Cookie header: exceeded available parameter key space"
# ### SOURCE: http://caedes.github.com/2012/07/28/rack-cookie-header-issue.html
# raise "remove this fix" if Gem.loaded_specs["rack"].version > Gem::Version.new("1.4.1")

# module Rack
#   module Utils
#     def parse_query(qs, d = nil)
#       params = KeySpaceConstrainedParams.new

#       (qs || '').split(d ? /[#{d}] */n : DEFAULT_SEP).each do |p|
#         k, v = p.split('=', 2).map { |x| unescape(x) }
#         next unless k || v

#         if cur = params[k]
#           if cur.class == Array
#             params[k] << v
#           else
#             params[k] = [cur, v]
#           end
#         else
#           params[k] = v
#         end
#       end

#       return params.to_params_hash
#     end

#     class KeySpaceConstrainedParams
#       def []=(key, value)
#         #@size += key.size if key && !@params.key?(key)
#         #raise RangeError, 'exceeded available parameter key space' if @size > @limit
#         @params[key] = value
#       end
#     end
#   end
# end